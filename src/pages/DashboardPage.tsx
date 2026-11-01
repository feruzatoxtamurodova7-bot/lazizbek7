import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Sparkles,
  Target,
  ArrowRight,
  Play,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { QUIZ_CATEGORIES, INITIAL_COURSES, INITIAL_LESSONS } from '../data/seed-data';
import { calculateLevelFromXP } from '../utils/quiz-engine';

export const DashboardPage: React.FC = () => {
  const { user, setActiveTab, startQuiz, setSelectedLesson, viewMode } = useApp();
  const isMobile = viewMode === 'mobile';

  const levelInfo = calculateLevelFromXP(user.xp);
  const goalPercent = Math.min(100, Math.round((user.today_xp / user.daily_goal_xp) * 100));

  // Weekly activity mockup (Monday to Sunday)
  const weeklyData = [
    { day: 'Dush', xp: 45, current: false },
    { day: 'Sesh', xp: 60, current: false },
    { day: 'Chor', xp: 35, current: false },
    { day: 'Pay', xp: 50, current: false },
    { day: 'Jum', xp: 75, current: false },
    { day: 'Shan', xp: 40, current: false },
    { day: 'Yak', xp: user.today_xp, current: true },
  ];
  const maxWeeklyXP = Math.max(...weeklyData.map((d) => d.xp), 80);

  const currentLesson = INITIAL_LESSONS[2]; // 3-dars

  return (
    <div className={`max-w-7xl mx-auto ${isMobile ? 'px-3 py-4 space-y-4' : 'px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6'} pb-24 md:pb-12`}>
      {/* Top Welcome Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#4169E1] via-[#5c77e8] to-[#8257E5] text-white shadow-xl relative overflow-hidden">
        <div className={`relative z-10 flex ${isMobile ? 'flex-col gap-4' : 'flex-col md:flex-row md:items-center justify-between gap-6'}`}>
          <div className="flex items-center gap-3.5 sm:gap-5">
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl object-cover ring-4 ring-white/20 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Faol o‘quvchi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                Привет, {user.full_name}! 👋
              </h1>
              <p className="text-blue-100 text-xs mt-0.5 font-medium line-clamp-1">
                Bugun rus tilida yangi cho‘qqilarni zabt etishga tayyormisiz?
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => startQuiz('grammar', 'A1')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white text-[#4169E1] font-bold text-xs sm:text-sm hover:bg-slate-50 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-[#4169E1]" />
              <span>Tezkor test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Gamified Stats Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        {/* Streak */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {user.streak} <span className="text-xs font-semibold text-slate-500">kun</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              O‘rganish seriyasi
            </div>
          </div>
        </div>

        {/* XP Points */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#4169E1] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-black text-[#4169E1] dark:text-blue-400 leading-tight">
              {user.xp} <span className="text-xs font-semibold text-slate-500">XP</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              Umumiy ballar
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-[#8257E5] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 leading-tight">
              {user.level}-daraja
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {levelInfo.title.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {user.total_questions_answered > 0
                ? Math.round((user.total_correct_answered / user.total_questions_answered) * 100)
                : 90}
              %
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              Aniqlik
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Progress & Weekly Chart */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-3 gap-6'}`}>
        {/* Left 2 Cols: Continue Learning & Daily Goal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Goal & XP to next level bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Bugungi maqsad: {user.today_xp} / {user.daily_goal_xp} XP
                </span>
              </div>
              <span className="text-xs font-bold text-purple-600">{goalPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4169E1] to-[#8257E5] transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            {/* Level progression bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Keyingi darajagacha ({levelInfo.level + 1}-daraja):</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {levelInfo.xpToNext} XP qoldi
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Continue Learning Active Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-slate-900 dark:to-slate-900 border border-blue-200/60 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1] bg-blue-100 dark:bg-blue-950/60 px-3 py-1 rounded-full">
                Davom ettirish
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>~8 daqiqa</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              {currentLesson.title_uz}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {currentLesson.description_uz}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-blue-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Mukofot: +{currentLesson.xp_reward} XP</span>
              </div>
              <button
                onClick={() => {
                  setSelectedLesson(currentLesson);
                  setActiveTab('courses');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#4169E1] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <span>Darsni boshlash</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recommended Quizzes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tavsiya etilgan testlar
              </h3>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="text-xs font-bold text-[#4169E1] hover:underline flex items-center gap-1"
              >
                <span>Barchasini ko‘rish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => startQuiz('grammar', 'A1')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#4169E1] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#4169E1] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#4169E1] transition-colors">
                      Grammatika A1
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      10 savol • +80 XP gacha
                    </span>
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#4169E1] group-hover:scale-125 transition-transform" />
              </div>

              <div
                onClick={() => startQuiz('vocabulary', 'A1')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#8257E5] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-[#8257E5] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#8257E5] transition-colors">
                      Lug‘at boyligi A1
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      10 savol • +80 XP gacha
                    </span>
                  </div>
                </div>
                <Play className="w-4 h-4 text-[#8257E5] group-hover:scale-125 transition-transform" />
              </div>
            </div>
          </div>

          {/* Special Quick Features: Flashcards & Mistake Book */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveTab('vocabulary')}
              className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800/60 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  📖
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Lug‘at va Fleshkartalar
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Ovozli talaffuz va kartalar
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-600" />
            </div>

            <div
              onClick={() => setActiveTab('mistakes')}
              className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-800/60 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  📕
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Xatolar kitobi
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Adashgan savollarni takrorlash
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Right Col: Weekly Activity Chart & Quick Categories */}
        <div className="space-y-6">
          {/* Weekly Activity Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Haftalik faollik
                </h3>
              </div>
              <span className="text-xs text-slate-500">Oxirgi 7 kun</span>
            </div>

            {/* Custom Interactive SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
              {weeklyData.map((d, i) => {
                const heightPercent = Math.max(15, Math.round((d.xp / maxWeeklyXP) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.xp}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        d.current
                          ? 'bg-gradient-to-t from-[#4169E1] to-[#8257E5] shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-300 dark:group-hover:bg-slate-700'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span
                      className={`text-[11px] font-semibold ${
                        d.current
                          ? 'text-[#4169E1] font-bold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Haftalik jami:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {weeklyData.reduce((acc, curr) => acc + curr.xp, 0)} XP
              </span>
            </div>
          </div>

          {/* Quick Categories List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Kategoriyalarga tezkor o‘tish
            </h3>
            <div className="space-y-2">
              {QUIZ_CATEGORIES.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startQuiz(cat.id, 'A1')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4169E1]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#4169E1] transition-colors">
                      {cat.title_uz}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
