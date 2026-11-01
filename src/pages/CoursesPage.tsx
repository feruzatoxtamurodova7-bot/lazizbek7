import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { CEFRLevel, Lesson } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
} from 'lucide-react';
import { speakRussian } from '../utils/audio';

export const CoursesPage: React.FC = () => {
  const { startQuiz, addToast, refreshUserData } = useApp();
  const [courses, setCourses] = useState(() => RusQuizStore.getCourses());
  const [lessons, setLessons] = useState(() => RusQuizStore.getLessons());
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);

  const levels: { level: CEFRLevel; title: string }[] = [
    { level: 'A1', title: 'Boshlang‘ich' },
    { level: 'A2', title: 'Elementar' },
    { level: 'B1', title: 'O‘rta' },
    { level: 'B2', title: 'Yuqori o‘rta' },
    { level: 'C1', title: 'Mukammal' },
  ];

  const currentCourse = courses.find((c) => c.level === selectedLevel) || courses[0];
  const levelLessons = lessons.filter((l) => l.course_level === selectedLevel);

  const handleCompleteLesson = (lesson: Lesson) => {
    RusQuizStore.completeLesson(lesson.id);
    setLessons(RusQuizStore.getLessons());
    setCourses(RusQuizStore.getCourses());
    refreshUserData();
    addToast(`Tabriklaymiz! "${lesson.title_uz}" yakunlandi!`, 'xp', lesson.xp_reward);
    setActiveLessonModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Rus tili kurslari
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          CEFR xalqaro standartlari bo‘yicha tuzilgan tizimli darslar va amaliy mashqlar
        </p>
      </div>

      {/* Level Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {levels.map((item) => {
          const isSelected = selectedLevel === item.level;
          return (
            <button
              key={item.level}
              onClick={() => setSelectedLevel(item.level)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="font-black mr-1.5">{item.level}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Course Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#4169E1] text-xs font-bold">
              <span>{currentCourse.badge}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {currentCourse.title_uz} ({currentCourse.title_ru})
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {currentCourse.description_uz}
            </p>
          </div>

          {/* Course Progress */}
          <div className="min-w-[200px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-2xl font-black text-[#4169E1]">
              {currentCourse.completed_lessons} / {currentCourse.total_lessons}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tugallangan darslar
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4169E1] to-[#8257E5] rounded-full"
                style={{
                  width: `${Math.round(
                    (currentCourse.completed_lessons / currentCourse.total_lessons) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Darslar jadvali ({selectedLevel})
        </h3>

        {levelLessons.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ushbu daraja uchun darslar tez orada to‘liq yuklanadi. Hozircha sinov testlarini
              yechishingiz mumkin!
            </p>
            <button
              onClick={() => startQuiz('grammar', selectedLevel)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#4169E1] text-white font-bold text-xs"
            >
              Test topshirish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#4169E1] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#4169E1] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                      {lesson.title_ru}
                    </span>
                    {lesson.is_completed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>O‘zlashtirildi</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{lesson.xp_reward} XP</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {lesson.title_uz}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {lesson.description_uz}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setActiveLessonModal(lesson)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center"
                  >
                    Darsni o‘qish
                  </button>
                  <button
                    onClick={() => startQuiz(lesson.quiz_category, lesson.course_level)}
                    className="py-2 px-3 rounded-xl bg-[#4169E1] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lesson Content Interactive Reader Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveLessonModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#4169E1] uppercase tracking-wider">
                {activeLessonModal.course_level} darajasi • Dars materiali
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeLessonModal.title_uz}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{activeLessonModal.title_ru}</p>
            </div>

            <div className="space-y-5">
              {activeLessonModal.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center justify-between">
                    <span>{t.title_uz}</span>
                    <button
                      onClick={() => speakRussian(t.example_ru)}
                      className="text-xs text-[#4169E1] hover:underline"
                    >
                      🔊 Ovozli eshitish
                    </button>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {t.description_uz}
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Qoida / Misollar:
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-mono">
                      {t.content_ru}
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Misol: </span>
                      <span className="italic">{t.example_ru}</span> — {t.example_uz}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleCompleteLesson(activeLessonModal)}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Darsni yakunlash (+{activeLessonModal.xp_reward} XP)</span>
              </button>
              <button
                onClick={() => {
                  const cat = activeLessonModal.quiz_category;
                  const lvl = activeLessonModal.course_level;
                  setActiveLessonModal(null);
                  startQuiz(cat, lvl);
                }}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>Test yechish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
