/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { QuizCategoriesPage } from './pages/QuizCategoriesPage';
import { QuizSessionPage } from './pages/QuizSessionPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { MistakeBookPage } from './pages/MistakeBookPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode, toggleViewMode } = useApp();

  // Support ?autostart=1 or ?tab= or ?view= query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const autostart = params.get('autostart');
      const viewParam = params.get('view');
      if (tabParam) {
        setActiveTab(tabParam as any);
      } else if (autostart === '1') {
        setActiveTab('home');
      }
      if (viewParam === 'desktop' || viewParam === 'mobile') {
        setViewMode(viewParam);
      }
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'home':
        return <DashboardPage />;
      case 'courses':
        return <CoursesPage />;
      case 'quizzes':
        return <QuizCategoriesPage />;
      case 'quiz_session':
        return <QuizSessionPage />;
      case 'quiz_results':
        return <QuizResultsPage />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'mistakes':
        return <MistakeBookPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isMobile = viewMode === 'mobile';

  return (
    <div
      className={`min-h-screen ${
        isMobile
          ? 'bg-slate-200/80 dark:bg-slate-900/90 py-0 md:py-6 flex flex-col items-center justify-start'
          : 'bg-[#F7F8FC] dark:bg-slate-950 flex flex-col'
      } font-sans transition-colors duration-200`}
    >
      {/* Floating View Mode Switcher on Desktop */}
      <div className="hidden md:flex items-center gap-2 mb-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 dark:border-slate-700 z-50">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Ko‘rinish rejimi:
        </span>
        <button
          onClick={() => setViewMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isMobile
              ? 'bg-[#4169E1] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>📱 Mobil ilova</span>
        </button>
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !isMobile
              ? 'bg-[#4169E1] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>💻 Keng ekran</span>
        </button>
      </div>

      {/* Main Container: Smartphone frame in mobile mode, full width in desktop mode */}
      <div
        className={`w-full ${
          isMobile
            ? 'max-w-[425px] min-h-screen md:min-h-[850px] md:max-h-[880px] md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] md:border-[10px] md:border-slate-900 dark:md:border-slate-800 overflow-y-auto flex flex-col bg-[#F7F8FC] dark:bg-slate-950 relative scrollbar-none'
            : 'min-h-screen flex flex-col bg-[#F7F8FC] dark:bg-slate-950 text-slate-800 dark:text-slate-100'
        }`}
      >
        {/* Mobile Smartphone Status Bar (Only in mobile mode on desktop) */}
        {isMobile && (
          <div className="hidden md:flex items-center justify-between px-7 pt-3 pb-1 text-slate-700 dark:text-slate-300 text-[11px] font-bold select-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs">
            <span>9:41</span>
            {/* Dynamic Island pill */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-16">{renderActiveTab()}</main>

        {/* Fixed Bottom Navigation for Mobile */}
        <BottomNav />

        {/* Global Modals & Notifications */}
        <AuthModal />
        <ToastContainer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
