import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const QuizResultsPage: React.FC = () => {
  const { lastQuizResult, setActiveTab, startQuiz } = useApp();

  useEffect(() => {
    // Fire festive confetti if score is >= 70%
    if (lastQuizResult && lastQuizResult.score_percent >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [lastQuizResult]);

  if (!lastQuizResult) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <Trophy className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Natijalar topilmadi
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Avval yangi test topshiring
        </p>
        <button
          onClick={() => setActiveTab('quizzes')}
          className="px-5 py-2.5 rounded-2xl bg-[#4169E1] text-white font-bold text-xs"
        >
          Testlar ro‘yxatiga o‘tish
        </button>
      </div>
    );
  }

  const allQuestions = RusQuizStore.getQuestions();
  const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

  const incorrectCount = lastQuizResult.total_questions - lastQuizResult.correct_count;

  let gradeMessage = 'Yana harakat qiling! Har bir xato — bu yangi bilim demakdir.';
  let gradeBadgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';

  if (lastQuizResult.score_percent === 100) {
    gradeMessage = 'Ajoyib! Barcha savollarga 100% to‘g‘ri javob berdingiz! Haqiqiy snayper!';
    gradeBadgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
  } else if (lastQuizResult.score_percent >= 80) {
    gradeMessage = 'Zo‘r natija! Rus tili grammatikasi va lug‘atini a’lo darajada o‘zlashtirmoqdasiz.';
    gradeBadgeColor = 'bg-blue-100 text-[#4169E1] dark:bg-blue-950/60 dark:text-blue-300';
  } else if (lastQuizResult.score_percent >= 60) {
    gradeMessage = 'Yaxshi harakat! Biroz ko‘proq mashq qilib, mukammallikka erishishingiz mumkin.';
    gradeBadgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Celebration Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#4169E1] to-[#8257E5] flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${gradeBadgeColor}`}
          >
            {lastQuizResult.score_percent}% Natija
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Test yakunlandi!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            {gradeMessage}
          </p>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">To‘g‘ri</div>
            <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lastQuizResult.correct_count}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Noto‘g‘ri</div>
            <div className="text-xl font-black text-rose-600 flex items-center justify-center gap-1 mt-0.5">
              <XCircle className="w-4 h-4" />
              <span>{incorrectCount}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sarflangan vaqt</div>
            <div className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{lastQuizResult.time_spent_seconds}s</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">Olingan XP</div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-4 h-4" />
              <span>+{lastQuizResult.xp_earned}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => startQuiz(lastQuizResult.category, lastQuizResult.level)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#4169E1] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta topshirish</span>
          </button>

          {incorrectCount > 0 && (
            <button
              onClick={() => setActiveTab('mistakes')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xatolar kitobiga o‘tish ({incorrectCount})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifaga qaytish</span>
          </button>
        </div>
      </div>

      {/* Question-by-Question Detailed Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Savollarning batafsil tahlili</span>
        </h3>

        <div className="space-y-3">
          {lastQuizResult.answers.map((ans, idx) => {
            const question = questionMap.get(ans.question_id);
            if (!question) return null;

            return (
              <div
                key={ans.question_id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                  ans.is_correct
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      #{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        ans.is_correct ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {ans.is_correct ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>To‘g‘ri</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Xato javob</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  {question.question_ru}
                </h4>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      ans.is_correct
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    <span className="font-bold block mb-0.5">Sizning javobingiz:</span>
                    <span>
                      {ans.selected_index >= 0
                        ? question.options[ans.selected_index]
                        : 'Vaqt yetmadi / Javob berilmadi'}
                    </span>
                  </div>

                  {!ans.is_correct && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300">
                      <span className="font-bold block mb-0.5">To‘g‘ri javob:</span>
                      <span>{question.options[question.correct_index]}</span>
                    </div>
                  )}
                </div>

                {/* Uzbek Explanation */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                    💡 O‘zbekcha qoida va izoh:
                  </span>
                  {question.explanation_uz}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
