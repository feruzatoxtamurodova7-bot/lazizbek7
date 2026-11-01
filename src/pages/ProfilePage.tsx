import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import {
  Flame,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Edit3,
  Trophy,
  Target,
  BookOpen,
  HelpCircle,
  Layers,
  X,
  Compass,
} from 'lucide-react';
import { calculateLevelFromXP } from '../utils/quiz-engine';

export const ProfilePage: React.FC = () => {
  const { user, setUser, addToast } = useApp();
  const [achievements, setAchievements] = useState(() => RusQuizStore.getAchievements());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user.full_name);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [avatarInput, setAvatarInput] = useState(user.avatar_url);

  const levelInfo = calculateLevelFromXP(user.xp);
  const accuracy =
    user.total_questions_answered > 0
      ? Math.round((user.total_correct_answered / user.total_questions_answered) * 100)
      : 88;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameInput.trim()) return;

    const updated = RusQuizStore.updateUserProfile({
      full_name: fullNameInput.trim(),
      username: usernameInput.trim(),
      avatar_url: avatarInput.trim() || user.avatar_url,
    });
    setUser(updated);
    addToast('Profil ma’lumotlari muvaffaqiyatli saqlandi!', 'success');
    setIsEditModalOpen(false);
  };

  const getAchievementIcon = (code: string) => {
    switch (code) {
      case 'first_quiz':
        return <Compass className="w-6 h-6 text-blue-500" />;
      case 'streak_7':
        return <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case 'questions_100':
        return <HelpCircle className="w-6 h-6 text-purple-500" />;
      case 'grammar_master':
        return <BookOpen className="w-6 h-6 text-emerald-500" />;
      case 'vocab_master':
        return <Layers className="w-6 h-6 text-pink-500" />;
      case 'perfect_score':
        return <Target className="w-6 h-6 text-rose-500" />;
      case 'top_10':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      default:
        return <Award className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 pb-24 md:pb-12">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-[#4169E1]/20 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#4169E1] text-white text-xs font-black shadow-md">
              Lvl {user.level}
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {user.full_name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  @{user.username} • {user.email}
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Tahrirlash</span>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#4169E1] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{levelInfo.title}</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>A’zolik sanasi: {user.created_at || '2026-10-20'}</span>
            </p>
          </div>
        </div>

        {/* 4 Key User Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Umumiy XP</div>
            <div className="text-xl sm:text-2xl font-black text-[#4169E1] mt-0.5">{user.xp}</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Streak</div>
            <div className="text-xl sm:text-2xl font-black text-amber-500 mt-0.5">
              {user.streak} kun
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Testlar soni</div>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {user.quizzes_count} ta
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Aniqlik</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{accuracy}%</div>
          </div>
        </div>
      </div>

      {/* Gamified Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Yutuqlar va nishonlar</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Faolligingiz va test natijalariga ko‘ra ochiladigan maxsus mukofotlar
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {achievements.filter((a) => a.is_unlocked).length} / {achievements.length} ochilgan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const percent = Math.min(
              100,
              Math.round((ach.current_value / ach.required_value) * 100)
            );

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border transition-all ${
                  ach.is_unlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      ach.is_unlocked
                        ? 'bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getAchievementIcon(ach.code)}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ach.is_unlocked
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {ach.is_unlocked ? '✓ Bajarildi' : `+${ach.xp_reward} XP`}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {ach.title_uz}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-4">
                  {ach.description_uz}
                </p>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Jarayon</span>
                    <span>
                      {ach.current_value} / {ach.required_value}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        ach.is_unlocked ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Profilni tahrirlash
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  To‘liq ism
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Foydalanuvchi nomi (@username)
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar rasm URL manzili
                </label>
                <input
                  type="text"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#4169E1] text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-xs"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
