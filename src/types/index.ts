export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type QuizCategoryKey =
  | 'grammar'
  | 'vocabulary'
  | 'spelling'
  | 'reading'
  | 'translation'
  | 'sentence_builder';

export interface QuizCategoryMeta {
  id: QuizCategoryKey;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  iconName: string;
  color: string;
  badgeColor: string;
}

export interface Question {
  id: string;
  category: QuizCategoryKey;
  level: CEFRLevel;
  question_ru: string;
  options: string[]; // 4 options
  correct_index: number; // 0..3
  explanation_uz: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_published: boolean;
  context_ru?: string; // e.g. for reading passages or sentence building
}

export interface QuizAnswerRecord {
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  time_seconds?: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  category: QuizCategoryKey;
  level: CEFRLevel;
  total_questions: number;
  correct_count: number;
  score_percent: number;
  xp_earned: number;
  time_spent_seconds: number;
  created_at: string;
  answers: QuizAnswerRecord[];
}

export interface VocabularyWord {
  id: string;
  word_ru: string;
  translation_uz: string;
  example_ru: string;
  example_uz: string;
  level: CEFRLevel;
  category: string;
  part_of_speech?: string;
  is_learned?: boolean;
  is_favorite?: boolean;
}

export interface LessonTopic {
  title_uz: string;
  description_uz: string;
  content_ru: string;
  example_ru: string;
  example_uz: string;
}

export interface Lesson {
  id: string;
  course_level: CEFRLevel;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  order: number;
  xp_reward: number;
  is_completed: boolean;
  topics: LessonTopic[];
  quiz_category: QuizCategoryKey;
}

export interface Course {
  level: CEFRLevel;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  target_audience: string;
  total_lessons: number;
  completed_lessons: number;
  color: string;
  badge: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role: 'user' | 'admin';
  avatar_url: string;
  xp: number;
  level: number;
  level_title: string;
  streak: number;
  last_login_date: string;
  daily_goal_xp: number;
  today_xp: number;
  quizzes_count: number;
  total_questions_answered: number;
  total_correct_answered: number;
  created_at: string;
  settings: {
    sound_enabled: boolean;
    timer_enabled: boolean;
    dark_mode: boolean;
    email_notifications: boolean;
    preferred_level: CEFRLevel;
  };
}

export interface Achievement {
  id: string;
  code: string;
  title_uz: string;
  title_ru: string;
  description_uz: string;
  icon: string;
  category: 'quiz' | 'streak' | 'accuracy' | 'special';
  required_value: number;
  current_value: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  xp_reward: number;
}

export interface LeaderboardUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  level: number;
  xp: number;
  rank: number;
  rank_change: number; // +1, -1, 0
  streak: number;
  is_current_user?: boolean;
}
