import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuizScore, calculateLevelFromXP, calculateStreak } from './quiz-engine';

test('calculateQuizScore computes scores and XP correctly', () => {
  // 10/10 questions correct: 10 base + 50 correct + 20 bonus = 80 XP
  const perfect = calculateQuizScore(10, 10);
  assert.equal(perfect.scorePercent, 100);
  assert.equal(perfect.baseXP, 10);
  assert.equal(perfect.correctXP, 50);
  assert.equal(perfect.perfectBonusXP, 20);
  assert.equal(perfect.totalXP, 80);
  assert.equal(perfect.isPerfect, true);
  assert.equal(perfect.performanceGrade, 'mukammal');

  // 7/10 questions correct: 10 base + 35 correct + 0 bonus = 45 XP
  const good = calculateQuizScore(10, 7);
  assert.equal(good.scorePercent, 70);
  assert.equal(good.totalXP, 45);
  assert.equal(good.isPerfect, false);
  assert.equal(good.performanceGrade, 'qoniqarli');

  // 0 questions total
  const zero = calculateQuizScore(0, 0);
  assert.equal(zero.totalXP, 0);
});

test('calculateLevelFromXP maps experience to progressive levels', () => {
  const lvl1 = calculateLevelFromXP(50);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.progressPercent, 50);

  const lvl2 = calculateLevelFromXP(150);
  assert.equal(lvl2.level, 2);

  const lvlHigh = calculateLevelFromXP(5500);
  assert.equal(lvlHigh.level, 8);
  assert.equal(lvlHigh.progressPercent, 100);
});

test('calculateStreak tracks consecutive and broken days', () => {
  // Initial login
  const first = calculateStreak(null, 0, '2026-11-01');
  assert.equal(first.newStreak, 1);
  assert.equal(first.isNewDay, true);

  // Same day login
  const sameDay = calculateStreak('2026-11-01', 3, '2026-11-01');
  assert.equal(sameDay.newStreak, 3);
  assert.equal(sameDay.isNewDay, false);

  // Consecutive day login (+1 day)
  const nextDay = calculateStreak('2026-11-01', 3, '2026-11-02');
  assert.equal(nextDay.newStreak, 4);
  assert.equal(nextDay.isNewDay, true);

  // Broken streak (jumped 3 days)
  const broken = calculateStreak('2026-11-01', 5, '2026-11-05');
  assert.equal(broken.newStreak, 1);
  assert.equal(broken.isNewDay, true);
});
