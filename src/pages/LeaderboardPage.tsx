import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { LeaderboardUser } from '../types';
import { Trophy, Flame, Sparkles, TrendingUp, TrendingDown, Minus, Crown, Medal } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useApp();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'overall'>('overall');

  const leaderboardUsers = RusQuizStore.getLeaderboard();

  // Top 3 Podium
  const top1 = leaderboardUsers[0];
  const top2 = leaderboardUsers[1];
  const top3 = leaderboardUsers[2];
  const restUsers = leaderboardUsers.slice(3);

  const currentUserRank = leaderboardUsers.find((u) => u.id === user.id || u.is_current_user)?.rank || 6;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8 pb-24 md:pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Peshqadamlar ro‘yxati (Рейтинг)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Rus tili o‘rganuvchilari orasida eng yuqori natijalar va XP ballari
        </p>

        {/* Timeframe Switcher Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mt-4 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'daily'
                ? 'bg-white dark:bg-slate-900 text-[#4169E1] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Kunlik
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-[#4169E1] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Haftalik
          </button>
          <button
            onClick={() => setTimeframe('overall')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'overall'
                ? 'bg-white dark:bg-slate-900 text-[#4169E1] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Umumiy
          </button>
        </div>
      </div>

      {/* Top 3 Podium (Olympic style: 2nd left, 1st center tall, 3rd right) */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 pt-4 max-w-lg mx-auto">
        {/* 2nd Place */}
        {top2 && (
          <div className="flex-1 flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top2.avatar_url}
                alt={top2.full_name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-slate-300 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[90px] text-center">
              {top2.full_name.split(' ')[0]}
            </h4>
            <span className="text-[11px] font-bold text-[#4169E1]">{top2.xp} XP</span>
            <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-800/60 mt-2 flex items-center justify-center border-t border-slate-300">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        )}

        {/* 1st Place (Center, tallest) */}
        {top1 && (
          <div className="flex-1 flex flex-col items-center -translate-y-2">
            <Crown className="w-7 h-7 text-amber-500 fill-amber-400 mb-1 animate-bounce" />
            <div className="relative mb-2">
              <img
                src={top1.avatar_url}
                alt={top1.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                1
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[100px] text-center">
              {top1.full_name.split(' ')[0]}
            </h4>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              {top1.xp} XP
            </span>
            <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 mt-2 flex items-center justify-center border-t border-amber-300">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="flex-1 flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={top3.avatar_url}
                alt={top3.full_name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-amber-700/40 shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700/60 text-white font-black text-xs flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[90px] text-center">
              {top3.full_name.split(' ')[0]}
            </h4>
            <span className="text-[11px] font-bold text-[#4169E1]">{top3.xp} XP</span>
            <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-100/60 to-amber-50 dark:from-slate-800 dark:to-slate-800/40 mt-2 flex items-center justify-center border-t border-amber-600/30">
              <Medal className="w-6 h-6 text-amber-700/60" />
            </div>
          </div>
        )}
      </div>

      {/* Current User Fixed Position Reminder */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-blue-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4169E1] text-white font-black text-sm flex items-center justify-center">
            #{currentUserRank}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Sizning hozirgi o‘rningiz
            </span>
            <span className="text-[11px] text-slate-500">
              Top-3 talikka kirish uchun yana {Math.max(0, (top3?.xp || 1000) - user.xp)} XP kerak
            </span>
          </div>
        </div>
        <span className="text-sm font-black text-[#4169E1]">{user.xp} XP</span>
      </div>

      {/* Full Ranking List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>O‘quvchi</span>
          <span>Natija</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboardUsers.map((item) => {
            const isMe = item.id === user.id || item.is_current_user;

            return (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isMe
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 font-bold'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Rank Number & Movement */}
                  <div className="w-8 flex flex-col items-center">
                    <span
                      className={`text-sm font-black ${
                        item.rank <= 3 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.rank}
                    </span>
                    {item.rank_change > 0 ? (
                      <span className="text-[10px] text-emerald-500 flex items-center">
                        <TrendingUp className="w-3 h-3" />
                      </span>
                    ) : item.rank_change < 0 ? (
                      <span className="text-[10px] text-rose-500 flex items-center">
                        <TrendingDown className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Avatar & Name */}
                  <img
                    src={item.avatar_url}
                    alt={item.full_name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.full_name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#4169E1] text-white font-bold">
                          Siz
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      Lvl {item.level} • {item.streak} kun streak
                    </span>
                  </div>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5 text-sm font-black text-[#4169E1] dark:text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{item.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
