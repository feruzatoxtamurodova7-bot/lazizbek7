import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { Home, BookOpen, HelpCircle, Trophy, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, viewMode } = useApp();

  // If in active quiz session, hide bottom navigation to maximize quiz focus and prevent accidental exit
  if (activeTab === 'quiz_session') return null;

  const items: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Bosh sahifa', icon: <Home className="w-5 h-5" /> },
    { id: 'courses', label: 'Kurslar', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'quizzes', label: 'Testlar', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'Reyting', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      className={`${
        viewMode === 'mobile' ? 'fixed md:sticky bottom-0' : 'md:hidden fixed bottom-0'
      } left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]`}
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive
                  ? 'text-[#4169E1] dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#4169E1] rounded-b-full shadow-xs" />
              )}
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 -translate-y-0.5' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] leading-tight truncate px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
