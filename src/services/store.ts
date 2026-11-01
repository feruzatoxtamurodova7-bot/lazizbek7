import {
  Achievement,
  Course,
  Lesson,
  Question,
  QuizAttempt,
  QuizCategoryKey,
  UserProfile,
  VocabularyWord,
  LeaderboardUser,
  CEFRLevel,
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_ACHIEVEMENTS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_QUESTIONS,
  INITIAL_VOCABULARY,
  INITIAL_LEADERBOARD,
} from '../data/seed-data';
import { calculateLevelFromXP, calculateQuizScore, calculateStreak } from '../utils/quiz-engine';

const STORAGE_KEYS = {
  USER: 'rusquiz_user',
  QUESTIONS: 'rusquiz_questions',
  COURSES: 'rusquiz_courses',
  LESSONS: 'rusquiz_lessons',
  VOCABULARY: 'rusquiz_vocabulary',
  ACHIEVEMENTS: 'rusquiz_achievements',
  ATTEMPTS: 'rusquiz_quiz_attempts',
  LEADERBOARD: 'rusquiz_leaderboard',
  MISTAKES_REVIEWED: 'rusquiz_mistakes_reviewed',
  SUPABASE_CONFIG: 'rusquiz_supabase_cfg',
};

const memoryStore: Record<string, string> = {};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      const mem = memoryStore[key];
      return mem ? JSON.parse(mem) : defaultValue;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      memoryStore[key] = serialized;
      return;
    }
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export class RusQuizStore {
  // User & Auth
  static getUser(): UserProfile {
    const user = getStoredItem<UserProfile>(STORAGE_KEYS.USER, DEFAULT_USER);
    // Refresh streak check
    const today = new Date().toISOString().split('T')[0];
    const { newStreak } = calculateStreak(user.last_login_date, user.streak, today);
    if (newStreak !== user.streak || user.last_login_date !== today) {
      user.streak = newStreak;
      user.last_login_date = today;
      this.saveUser(user);
    }
    return user;
  }

  static saveUser(user: UserProfile): void {
    setStoredItem(STORAGE_KEYS.USER, user);
  }

  static updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    this.saveUser(updated);
    this.syncLeaderboardWithUser(updated);
    return updated;
  }

  static login(email: string, _pass: string, asAdmin = false): UserProfile {
    const user = this.getUser();
    user.email = email;
    if (asAdmin) user.role = 'admin';
    this.saveUser(user);
    return user;
  }

  static register(name: string, email: string, username: string): UserProfile {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: 'usr_' + Date.now(),
      full_name: name,
      email,
      username,
      xp: 0,
      level: 1,
      streak: 1,
      quizzes_count: 0,
      total_correct_answered: 0,
      total_questions_answered: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    this.saveUser(newUser);
    return newUser;
  }

  static logout(): void {
    // For demo convenience, retain guest account with reset
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Questions (Admin + Quiz)
  static getQuestions(): Question[] {
    return getStoredItem<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }

  static saveQuestions(questions: Question[]): void {
    setStoredItem(STORAGE_KEYS.QUESTIONS, questions);
  }

  static addQuestion(question: Omit<Question, 'id'>): Question {
    const all = this.getQuestions();
    const newQ: Question = {
      ...question,
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    all.unshift(newQ);
    this.saveQuestions(all);
    return newQ;
  }

  static updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const all = this.getQuestions();
    const idx = all.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    this.saveQuestions(all);
    return all[idx];
  }

  static deleteQuestion(id: string): boolean {
    const all = this.getQuestions();
    const filtered = all.filter((q) => q.id !== id);
    this.saveQuestions(filtered);
    return true;
  }

  static getQuizQuestions(category?: QuizCategoryKey, level?: CEFRLevel, count = 10): Question[] {
    let pool = this.getQuestions().filter((q) => q.is_published);
    if (category) {
      const matchCat = pool.filter((q) => q.category === category);
      if (matchCat.length >= 3) pool = matchCat;
    }
    if (level) {
      const matchLevel = pool.filter((q) => q.level === level);
      if (matchLevel.length >= 3) pool = matchLevel;
    }

    // Shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Quiz Attempts & Results
  static getAttempts(): QuizAttempt[] {
    return getStoredItem<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  }

  static recordQuizAttempt(
    category: QuizCategoryKey,
    level: CEFRLevel,
    answers: { question_id: string; selected_index: number; is_correct: boolean }[],
    timeSpentSeconds: number
  ): { attempt: QuizAttempt; updatedUser: UserProfile; unlockedAchievements: Achievement[] } {
    const user = this.getUser();
    const total = answers.length;
    const correct = answers.filter((a) => a.is_correct).length;
    const scoreResult = calculateQuizScore(total, correct);

    const attempt: QuizAttempt = {
      id: 'att_' + Date.now(),
      user_id: user.id,
      category,
      level,
      total_questions: total,
      correct_count: correct,
      score_percent: scoreResult.scorePercent,
      xp_earned: scoreResult.totalXP,
      time_spent_seconds: timeSpentSeconds,
      created_at: new Date().toISOString(),
      answers,
    };

    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    setStoredItem(STORAGE_KEYS.ATTEMPTS, attempts);

    // Update User XP & Progression
    const newXP = user.xp + scoreResult.totalXP;
    const levelInfo = calculateLevelFromXP(newXP);

    const updatedUser: UserProfile = {
      ...user,
      xp: newXP,
      level: levelInfo.level,
      level_title: levelInfo.title,
      today_xp: user.today_xp + scoreResult.totalXP,
      quizzes_count: user.quizzes_count + 1,
      total_questions_answered: user.total_questions_answered + total,
      total_correct_answered: user.total_correct_answered + correct,
    };
    this.saveUser(updatedUser);
    this.syncLeaderboardWithUser(updatedUser);

    // Check achievements
    const unlockedAchievements = this.checkAchievements(updatedUser, attempt);

    return { attempt, updatedUser, unlockedAchievements };
  }

  // Mistake Book
  static getMistakeQuestions(): { question: Question; failedCount: number; isReviewed: boolean }[] {
    const attempts = this.getAttempts();
    const reviewedIds = new Set(getStoredItem<string[]>(STORAGE_KEYS.MISTAKES_REVIEWED, []));
    const allQuestions = this.getQuestions();
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    const failedMap = new Map<string, number>();

    attempts.forEach((att) => {
      att.answers.forEach((ans) => {
        if (!ans.is_correct) {
          failedMap.set(ans.question_id, (failedMap.get(ans.question_id) || 0) + 1);
        }
      });
    });

    const result: { question: Question; failedCount: number; isReviewed: boolean }[] = [];
    failedMap.forEach((count, qId) => {
      const q = questionMap.get(qId);
      if (q) {
        result.push({
          question: q,
          failedCount: count,
          isReviewed: reviewedIds.has(qId),
        });
      }
    });

    // If empty for demo, inject sample mistake questions so user can immediately test Mistake Book!
    if (result.length === 0) {
      const sampleMistakes = allQuestions.slice(0, 3);
      return sampleMistakes.map((q, idx) => ({
        question: q,
        failedCount: idx + 1,
        isReviewed: false,
      }));
    }

    return result;
  }

  static markMistakeReviewed(questionId: string, reviewed = true): void {
    const list = new Set(getStoredItem<string[]>(STORAGE_KEYS.MISTAKES_REVIEWED, []));
    if (reviewed) list.add(questionId);
    else list.delete(questionId);
    setStoredItem(STORAGE_KEYS.MISTAKES_REVIEWED, Array.from(list));
  }

  // Courses & Lessons
  static getCourses(): Course[] {
    return getStoredItem<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  static getLessons(): Lesson[] {
    return getStoredItem<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
  }

  static completeLesson(lessonId: string): Lesson | null {
    const lessons = this.getLessons();
    const target = lessons.find((l) => l.id === lessonId);
    if (!target) return null;

    if (!target.is_completed) {
      target.is_completed = true;
      setStoredItem(STORAGE_KEYS.LESSONS, lessons);

      // Award XP
      const user = this.getUser();
      const newXP = user.xp + target.xp_reward;
      const lvl = calculateLevelFromXP(newXP);
      this.saveUser({
        ...user,
        xp: newXP,
        level: lvl.level,
        level_title: lvl.title,
        today_xp: user.today_xp + target.xp_reward,
      });

      // Update course completed count
      const courses = this.getCourses();
      const course = courses.find((c) => c.level === target.course_level);
      if (course) {
        course.completed_lessons = Math.min(course.total_lessons, course.completed_lessons + 1);
        setStoredItem(STORAGE_KEYS.COURSES, courses);
      }
    }
    return target;
  }

  // Vocabulary
  static getVocabulary(): VocabularyWord[] {
    return getStoredItem<VocabularyWord[]>(STORAGE_KEYS.VOCABULARY, INITIAL_VOCABULARY);
  }

  static toggleVocabularyLearned(id: string): boolean {
    const words = this.getVocabulary();
    const word = words.find((w) => w.id === id);
    if (!word) return false;
    word.is_learned = !word.is_learned;
    setStoredItem(STORAGE_KEYS.VOCABULARY, words);
    return !!word.is_learned;
  }

  static toggleVocabularyFavorite(id: string): boolean {
    const words = this.getVocabulary();
    const word = words.find((w) => w.id === id);
    if (!word) return false;
    word.is_favorite = !word.is_favorite;
    setStoredItem(STORAGE_KEYS.VOCABULARY, words);
    return !!word.is_favorite;
  }

  // Achievements
  static getAchievements(): Achievement[] {
    return getStoredItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  }

  private static checkAchievements(user: UserProfile, lastAttempt?: QuizAttempt): Achievement[] {
    const achievements = this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    achievements.forEach((ach) => {
      if (ach.is_unlocked) return;

      let shouldUnlock = false;
      if (ach.code === 'first_quiz' && user.quizzes_count >= 1) shouldUnlock = true;
      if (ach.code === 'streak_7' && user.streak >= 7) shouldUnlock = true;
      if (ach.code === 'questions_100' && user.total_correct_answered >= 100) shouldUnlock = true;
      if (ach.code === 'perfect_score' && lastAttempt && lastAttempt.score_percent === 100) shouldUnlock = true;

      if (shouldUnlock) {
        ach.is_unlocked = true;
        ach.unlocked_at = new Date().toISOString().split('T')[0];
        ach.current_value = ach.required_value;
        newlyUnlocked.push(ach);
      }
    });

    if (newlyUnlocked.length > 0) {
      setStoredItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
    }
    return newlyUnlocked;
  }

  // Leaderboard
  static getLeaderboard(): LeaderboardUser[] {
    const board = getStoredItem<LeaderboardUser[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    const user = this.getUser();
    // Ensure current user is in leaderboard with their real live XP
    const userIdx = board.findIndex((u) => u.id === user.id || u.is_current_user);
    if (userIdx !== -1) {
      board[userIdx].xp = user.xp;
      board[userIdx].level = user.level;
      board[userIdx].streak = user.streak;
      board[userIdx].full_name = user.full_name;
    } else {
      board.push({
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        avatar_url: user.avatar_url,
        level: user.level,
        xp: user.xp,
        rank: 9,
        rank_change: 0,
        streak: user.streak,
        is_current_user: true,
      });
    }

    // Re-rank
    board.sort((a, b) => b.xp - a.xp);
    board.forEach((u, i) => {
      u.rank = i + 1;
    });

    return board;
  }

  private static syncLeaderboardWithUser(user: UserProfile): void {
    const board = this.getLeaderboard();
    setStoredItem(STORAGE_KEYS.LEADERBOARD, board);
  }

  // Supabase Config helper
  static getSupabaseConfig(): { url: string; anonKey: string; isConnected: boolean } {
    return getStoredItem(STORAGE_KEYS.SUPABASE_CONFIG, {
      url: '',
      anonKey: '',
      isConnected: false,
    });
  }

  static saveSupabaseConfig(url: string, anonKey: string): void {
    setStoredItem(STORAGE_KEYS.SUPABASE_CONFIG, {
      url,
      anonKey,
      isConnected: !!(url && anonKey),
    });
  }

  // Reset demo
  static resetToDefaults(): void {
    localStorage.clear();
  }
}
