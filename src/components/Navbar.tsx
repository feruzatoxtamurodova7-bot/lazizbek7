import React, { useState, useRef, useEffect } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Flame,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  BookOpen,
  Languages,
  Award,
  Layers,
  HelpCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, activeTab, setActiveTab, theme, toggleTheme, setIsAuthModalOpen, setAuthMode, viewMode, toggleViewMode } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Bosh sahifa', icon: <Layers className="w-4 h-4" /> },
    { id: 'courses', label: 'Kurslar', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quizzes', label: 'Testlar', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'vocabulary', label: 'Lug‘at', icon: <Languages className="w-4 h-4" /> },
    { id: 'mistakes', label: 'Xatolar kitobi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Reyting', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4169E1] to-[#8257E5] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tight">RQ</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#4169E1] to-[#8257E5] bg-clip-text text-transparent">
                  RusQuiz
                </span>
                <span className="hidden lg:block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  Rus tili online test platformasi
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links (only in desktop view mode) */}
            {viewMode === 'desktop' && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-[#4169E1] dark:bg-blue-950/60 dark:text-blue-300'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Switcher (only in desktop view mode) */}
            {viewMode === 'desktop' && (
              <button
                onClick={toggleViewMode}
                title="Mobil ko‘rinishga o‘tish"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Mobil ko‘rinish</span>
              </button>
            )}

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold shadow-xs"
              title="Ketma-ket faol kunlar"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{user.streak}k</span>
            </div>

            {/* XP Points Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-[#4169E1] dark:text-blue-400 text-xs sm:text-sm font-bold shadow-xs"
              title="To‘plangan tajriba ballari"
            >
              <Sparkles className="w-4 h-4 text-[#4169E1] dark:text-blue-400" />
              <span>{user.xp}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Rang mavzusini o'zgartirish"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin Badge link (if admin) */}
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4169E1]/30"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#4169E1] dark:bg-blue-900/40 dark:text-blue-300">
                      {user.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Mening profilim</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-500" />
                    <span>Sozlamalar</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left font-medium"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin boshqaruv paneli</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab('landing');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Tanishuv sahifasi</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Chiqish / Boshqa hisob</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
