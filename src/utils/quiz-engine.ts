/**
 * RusQuiz Core Logic Engine
 * Pure logic for scoring, XP calculation, level progression, streak tracking, and mistake collection.
 */

export interface QuizScoringResult {
  scorePercent: number;
  baseXP: number;
  correctXP: number;
  perfectBonusXP: number;
  totalXP: number;
  isPerfect: boolean;
  performanceGrade: 'mukammal' | 'yaxshi' | 'qoniqarli' | 'yana_harakat';
}

export function calculateQuizScore(total: number, correct: number): QuizScoringResult {
  if (total <= 0) {
    return {
      scorePercent: 0,
      baseXP: 0,
      correctXP: 0,
      perfectBonusXP: 0,
      totalXP: 0,
      isPerfect: false,
      performanceGrade: 'yana_harakat',
    };
  }

  const scorePercent = Math.round((correct / total) * 100);
  const baseXP = 10; // Completion bonus
  const correctXP = correct * 5; // +5 per correct
  const isPerfect = correct === total && total > 0;
  const perfectBonusXP = isPerfect ? 20 : 0;
  const totalXP = baseXP + correctXP + perfectBonusXP;

  let performanceGrade: QuizScoringResult['performanceGrade'] = 'yana_harakat';
  if (scorePercent === 100) performanceGrade = 'mukammal';
  else if (scorePercent >= 80) performanceGrade = 'yaxshi';
  else if (scorePercent >= 60) performanceGrade = 'qoniqarli';

  return {
    scorePercent,
    baseXP,
    correctXP,
    perfectBonusXP,
    totalXP,
    isPerfect,
    performanceGrade,
  };
}

export interface LevelInfo {
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  xpToNext: number;
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Boshlovchi (Новичок)', minXP: 0, maxXP: 100 },
  { level: 2, title: 'Havaskor (Ученик)', minXP: 100, maxXP: 250 },
  { level: 3, title: 'Izlanuvchi (Искатель)', minXP: 250, maxXP: 500 },
  { level: 4, title: 'Bilimdon (Знаток)', minXP: 500, maxXP: 900 },
  { level: 5, title: 'Usta (Мастер)', minXP: 900, maxXP: 1500 },
  { level: 6, title: 'Ekspert (Эксперт)', minXP: 1500, maxXP: 2400 },
  { level: 7, title: 'Poliglot (Полиглот)', minXP: 2400, maxXP: 3600 },
  { level: 8, title: 'Afsona (Легенда)', minXP: 3600, maxXP: 5000 },
];

export function calculateLevelFromXP(xp: number): LevelInfo {
  const safeXP = Math.max(0, xp);
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const thresh = LEVEL_THRESHOLDS[i];
    if (safeXP < thresh.maxXP || i === LEVEL_THRESHOLDS.length - 1) {
      const levelRange = thresh.maxXP - thresh.minXP;
      const progressInLevel = Math.min(safeXP - thresh.minXP, levelRange);
      const progressPercent = Math.min(100, Math.max(0, Math.round((progressInLevel / levelRange) * 100)));
      const xpToNext = Math.max(0, thresh.maxXP - safeXP);

      return {
        level: thresh.level,
        title: thresh.title,
        currentLevelXP: safeXP,
        nextLevelXP: thresh.maxXP,
        progressPercent,
        xpToNext,
      };
    }
  }

  return {
    level: 8,
    title: 'Afsona (Легенда)',
    currentLevelXP: safeXP,
    nextLevelXP: 5000,
    progressPercent: 100,
    xpToNext: 0,
  };
}

export function calculateStreak(
  lastLoginDateStr: string | null,
  currentStreak: number,
  todayDateStr: string
): { newStreak: number; isNewDay: boolean } {
  if (!lastLoginDateStr) {
    return { newStreak: 1, isNewDay: true };
  }

  const lastDate = new Date(lastLoginDateStr);
  const today = new Date(todayDateStr);

  // Normalize to UTC midnight dates
  const lastUtc = Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate());
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  const diffDays = Math.round((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day login
    return { newStreak: Math.max(1, currentStreak), isNewDay: false };
  } else if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, isNewDay: true };
  } else {
    // Streak broken
    return { newStreak: 1, isNewDay: true };
  }
}
