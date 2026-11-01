import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import {
  BookOpen,
  CheckCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Volume2,
  Trash2,
  Flame,
} from 'lucide-react';
import { speakRussian, playSound } from '../utils/audio';

export const MistakeBookPage: React.FC = () => {
  const { startQuiz, addToast } = useApp();
  const [mistakes, setMistakes] = useState(() => RusQuizStore.getMistakeQuestions());

  const handleToggleReviewed = (qId: string, currentVal: boolean) => {
    playSound('click');
    RusQuizStore.markMistakeReviewed(qId, !currentVal);
    setMistakes(RusQuizStore.getMistakeQuestions());
    addToast(
      !currentVal ? 'Mavzu tahlil qilingan deb belgilandi!' : 'Qayta o‘rganishga qaytarildi',
      'info'
    );
  };

  const handleRetryAllMistakes = () => {
    if (mistakes.length === 0) return;
    const ids = mistakes.map((m) => m.question.id);
    startQuiz(undefined, undefined, true, ids);
  };

  const reviewedCount = mistakes.filter((m) => m.isReviewed).length;
  const progressPercent =
    mistakes.length > 0 ? Math.round((reviewedCount / mistakes.length) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Xatolar kitobi (Книга ошибок)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Testlarda adashgan savollaringiz tahlili va ularni qayta mustahkamlash markazi
          </p>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={handleRetryAllMistakes}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Xatolarni qayta yechish ({mistakes.length})</span>
          </button>
        )}
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Xatolarni bartaraf etish darajasi: {reviewedCount} / {mistakes.length} ta savol
            </h3>
          </div>
          <span className="text-xs font-bold text-purple-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4169E1] to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mistakes List */}
      {mistakes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ajoyib! Hozircha birorta xato savol yo‘q
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Testlarni yechishda adashgan savollaringiz avtomatik shu yerga yozib boriladi.
          </p>
          <button
            onClick={() => startQuiz('grammar', 'A1')}
            className="px-6 py-2.5 rounded-2xl bg-[#4169E1] text-white font-bold text-xs"
          >
            Yangi test topshirish
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map(({ question, failedCount, isReviewed }) => (
            <div
              key={question.id}
              className={`p-6 rounded-3xl border transition-all ${
                isReviewed
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-900/60 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {question.level} • {question.category}
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
                    {failedCount} marta adashilgan
                  </span>
                </div>

                <button
                  onClick={() => handleToggleReviewed(question.id, isReviewed)}
                  className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                    isReviewed
                      ? 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isReviewed ? 'O‘zlashtirildi ✓' : 'Tahlil qilindi deb belgilash'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {question.question_ru}
                </h3>
                <button
                  onClick={() => speakRussian(question.question_ru)}
                  className="p-1.5 rounded-xl text-[#4169E1] hover:bg-blue-50 dark:hover:bg-blue-950/40 shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Correct answer display */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-semibold mb-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-xs mb-0.5">
                  To‘g‘ri variant:
                </span>
                {question.options[question.correct_index]}
              </div>

              {/* Uzbek Explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                  💡 Nega shunday? O‘zbekcha qoida va izoh:
                </span>
                {question.explanation_uz}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
