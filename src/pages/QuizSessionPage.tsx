import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { Question, QuizAnswerRecord } from '../types';
import {
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { playSound, speakRussian } from '../utils/audio';

export const QuizSessionPage: React.FC = () => {
  const { activeQuizConfig, setActiveTab, setLastQuizResult, addToast, refreshUserData } = useApp();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selectedIndex: number; isCorrect: boolean }>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30); // 30s per question
  const [timerActive, setTimerActive] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Initialize questions
  useEffect(() => {
    let list: Question[] = [];
    if (activeQuizConfig?.isMistakeRetry && activeQuizConfig.mistakeQuestionIds) {
      const allQ = RusQuizStore.getQuestions();
      list = allQ.filter((q) => activeQuizConfig.mistakeQuestionIds?.includes(q.id));
    } else {
      list = RusQuizStore.getQuizQuestions(activeQuizConfig?.category, activeQuizConfig?.level, 10);
    }

    if (list.length === 0) {
      list = RusQuizStore.getQuestions().slice(0, 10);
    }

    setQuestions(list);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsAnswerRevealed(false);
    setSecondsRemaining(30);
    setTotalTimeSpent(0);
  }, [activeQuizConfig]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || isAnswerRevealed || questions.length === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time expired for this question: trigger auto-submission if not answered
          handleSelectOption(-1);
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, isAnswerRevealed, questions.length, currentIndex]);

  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#4169E1] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Savollar yuklanmoqda...
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed || currentAnswer !== undefined) return;

    const isCorrect = index === currentQ.correct_index;
    playSound(isCorrect ? 'correct' : 'incorrect');

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selectedIndex: index, isCorrect },
    }));
    setIsAnswerRevealed(true);
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(userAnswers[currentIndex + 1] !== undefined);
      setSecondsRemaining(30);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsAnswerRevealed(true);
      setSecondsRemaining(30);
    }
  };

  const finishQuiz = () => {
    // Compile answers
    const answersRecord: QuizAnswerRecord[] = questions.map((q, idx) => {
      const ans = userAnswers[idx];
      return {
        question_id: q.id,
        selected_index: ans ? ans.selectedIndex : -1,
        is_correct: ans ? ans.isCorrect : false,
      };
    });

    const category = activeQuizConfig?.category || 'grammar';
    const level = activeQuizConfig?.level || 'A1';

    const { attempt, unlockedAchievements } = RusQuizStore.recordQuizAttempt(
      category,
      level,
      answersRecord,
      totalTimeSpent
    );

    refreshUserData();
    playSound('complete');
    setLastQuizResult(attempt);

    if (unlockedAchievements.length > 0) {
      unlockedAchievements.forEach((ach) => {
        addToast(`Yutuq ochildi: "${ach.title_uz}"!`, 'xp', ach.xp_reward);
      });
    }

    setActiveTab('quiz_results');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Header Bar: Exit button, Timer, Progress */}
      <div className="flex items-center justify-between gap-4">
        {/* Exit Button */}
        <button
          onClick={() => setShowExitModal(true)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">Chiqish</span>
        </button>

        {/* Question Counter Pill */}
        <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-black">
          Savol: {currentIndex + 1} / {questions.length}
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            secondsRemaining <= 10
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 animate-pulse'
              : 'bg-blue-50 dark:bg-blue-950/60 text-[#4169E1]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{secondsRemaining}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#4169E1] to-[#8257E5] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Context or Reading passage if present */}
        {currentQ.context_ru && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <span className="font-bold text-[#4169E1] block mb-1">Matn / Vazifa:</span>
            {currentQ.context_ru}
          </div>
        )}

        {/* Question Text in Russian */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.question_ru}
          </h2>
          <button
            onClick={() => speakRussian(currentQ.question_ru)}
            title="Ruscha talaffuzni eshitish"
            className="p-2 rounded-xl text-[#4169E1] hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors shrink-0"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = currentAnswer?.selectedIndex === optIdx;
            const isCorrect = optIdx === currentQ.correct_index;

            let btnClass =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#4169E1] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-slate-800 dark:text-slate-200';

            if (isAnswerRevealed) {
              if (isCorrect) {
                btnClass =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isSelected && !isCorrect) {
                btnClass =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/30';
              } else {
                btnClass = 'opacity-50 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswerRevealed}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base flex items-center justify-between transition-all ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#4169E1] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerRevealed && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswerRevealed && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation in Uzbek */}
        {isAnswerRevealed && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm animate-in fade-in ${
              currentAnswer?.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>
                {currentAnswer?.isCorrect ? 'To‘g‘ri javob!' : 'O‘zbekcha tushuntirish va qoida:'}
              </span>
            </div>
            <p className="leading-relaxed">{currentQ.explanation_uz}</p>
          </div>
        )}
      </div>

      {/* Navigation Controls: Prev, Next / Finish */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors ${
            currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Oldingisi</span>
        </button>

        {isAnswerRevealed ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <span>{currentIndex === questions.length - 1 ? 'Natijani ko‘rish' : 'Keyingi savol'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-slate-400 italic">Javob variantini tanlang...</span>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Testni to‘xtatmoqchimisiz?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Hozir chiqsangiz, to‘plangan javoblaringiz saqlanmaydi va tajriba ballari (XP) berilmaydi.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Davom etish
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  setActiveTab('quizzes');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
