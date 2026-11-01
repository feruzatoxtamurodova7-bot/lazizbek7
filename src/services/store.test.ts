import test from 'node:test';
import assert from 'node:assert/strict';
import { RusQuizStore } from './store';

test('RusQuizStore retrieves initial questions and seeds', () => {
  const questions = RusQuizStore.getQuestions();
  assert.ok(questions.length > 10, 'Expected at least 10 seeded questions');
  const sample = questions[0];
  assert.ok(sample.question_ru, 'Question must have Russian text');
  assert.equal(sample.options.length, 4, 'Question must have 4 options');
  assert.ok(sample.explanation_uz, 'Question must have Uzbek explanation');
});

test('RusQuizStore adds, updates, and deletes questions (admin capability)', () => {
  const newQ = RusQuizStore.addQuestion({
    category: 'grammar',
    level: 'A1',
    question_ru: 'Тестовый вопрос?',
    options: ['А', 'Б', 'В', 'Г'],
    correct_index: 0,
    explanation_uz: 'Test izohi',
    difficulty: 'easy',
    is_published: true,
  });
  assert.ok(newQ.id, 'New question must have generated ID');

  const updated = RusQuizStore.updateQuestion(newQ.id, { question_ru: 'Обновлённый вопрос?' });
  assert.equal(updated?.question_ru, 'Обновлённый вопрос?');

  const deleted = RusQuizStore.deleteQuestion(newQ.id);
  assert.equal(deleted, true);

  const found = RusQuizStore.getQuestions().find((q) => q.id === newQ.id);
  assert.equal(found, undefined, 'Deleted question should not exist');
});

test('RusQuizStore records quiz attempt and updates XP and streak', () => {
  const userBefore = RusQuizStore.getUser();
  const xpBefore = userBefore.xp;

  const result = RusQuizStore.recordQuizAttempt(
    'grammar',
    'A1',
    [
      { question_id: 'q-g1', selected_index: 1, is_correct: true },
      { question_id: 'q-g2', selected_index: 1, is_correct: true },
      { question_id: 'q-g3', selected_index: 0, is_correct: false },
    ],
    45
  );

  assert.equal(result.attempt.correct_count, 2);
  assert.equal(result.attempt.total_questions, 3);
  assert.ok(result.updatedUser.xp > xpBefore, 'User XP must increase after quiz attempt');
});
