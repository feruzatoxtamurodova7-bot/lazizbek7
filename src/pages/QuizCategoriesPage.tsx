import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUIZ_CATEGORIES } from '../data/seed-data';
import { CEFRLevel, QuizCategoryKey } from '../types';
import {
  BookOpen,
  Languages,
  PenTool,
  Glasses,
  ArrowLeftRight,
  Layers,
  Play,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';
import { RusQuizStore } from '../services/store';

export const QuizCategoriesPage: React.FC = () => {
  const { startQuiz } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');

  const allQuestions = RusQuizStore.getQuestions().filter((q) => q.is_published);

  const getIcon = (id: QuizCategoryKey) => {
    switch (id) {
      case 'grammar':
        return <BookOpen className="w-6 h-6" />;
      case 'vocabulary':
        return <Languages className="w-6 h-6" />;
      case 'spelling':
        return <PenTool className="w-6 h-6" />;
      case 'reading':
        return <Glasses className="w-6 h-6" />;
      case 'translation':
        return <ArrowLeftRight className="w-6 h-6" />;
      case 'sentence_builder':
        return <Layers className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const levels: { id: CEFRLevel | 'all'; label: string }[] = [
    { id: 'all', label: 'Barcha darajalar' },
    { id: 'A1', label: 'A1 — Boshlang‘ich' },
    { id: 'A2', label: 'A2 — Elementar' },
    { id: 'B1', label: 'B1 — O‘rta' },
    { id: 'B2', label: 'B2 — Yuqori' },
    { id: 'C1', label: 'C1 — Mukammal' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Test yo‘nalishlari
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Qiziqqan sohangizni tanlang va 10 ta savolli qiziqarli test orqali o‘z bilimingizni sinab ko‘ring
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtr:</span>
        </div>
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#4169E1] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {lvl.label}
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZ_CATEGORIES.map((cat) => {
          const questionsCount = allQuestions.filter((q) => {
            if (q.category !== cat.id) return false;
            if (selectedLevel !== 'all' && q.level !== selectedLevel) return false;
            return true;
          }).length;

          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#4169E1] hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {getIcon(cat.id)}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {questionsCount} ta savol
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
                  {cat.title_uz}
                </h3>
                <span className="text-xs font-semibold text-[#4169E1] dark:text-blue-400 block mb-3">
                  {cat.title_ru}
                </span>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {cat.description_uz}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+80 XP gacha</span>
                </div>
                <button
                  onClick={() =>
                    startQuiz(cat.id, selectedLevel === 'all' ? undefined : selectedLevel)
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Testni boshlash</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
