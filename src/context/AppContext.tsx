import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  QuizAttempt,
  QuizCategoryKey,
  CEFRLevel,
  Lesson,
} from '../types';
import { RusQuizStore } from '../services/store';
import { playSound } from '../utils/audio';

export type AppTab =
  | 'landing'
  | 'home'
  | 'courses'
  | 'quizzes'
  | 'quiz_session'
  | 'quiz_results'
  | 'vocabulary'
  | 'mistakes'
  | 'leaderboard'
  | 'profile'
  | 'settings'
  | 'admin';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'xp' | 'error';
  xpAmount?: number;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  activeQuizConfig: {
    category?: QuizCategoryKey;
    level?: CEFRLevel;
    isMistakeRetry?: boolean;
    mistakeQuestionIds?: string[];
  } | null;
  startQuiz: (category?: QuizCategoryKey, level?: CEFRLevel, isMistakeRetry?: boolean, mistakeQuestionIds?: string[]) => void;
  lastQuizResult: QuizAttempt | null;
  setLastQuizResult: (res: QuizAttempt | null) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], xpAmount?: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  viewMode: 'mobile' | 'desktop';
  setViewMode: (mode: 'mobile' | 'desktop') => void;
  toggleViewMode: () => void;
  refreshUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => RusQuizStore.getUser());
  const [activeTab, setActiveTabState] = useState<AppTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeQuizConfig, setActiveQuizConfig] = useState<AppContextType['activeQuizConfig']>(null);
  const [lastQuizResult, setLastQuizResult] = useState<QuizAttempt | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return user.settings?.dark_mode ? 'dark' : 'light';
  });
  const [viewMode, setViewModeState] = useState<'mobile' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('view');
      if (param === 'desktop') return 'desktop';
      if (param === 'mobile') return 'mobile';
      const saved = localStorage.getItem('rusquiz_view_mode');
      if (saved === 'desktop' || saved === 'mobile') return saved;
    }
    return 'mobile'; // Default to mobile view as requested by user
  });

  const setViewMode = (mode: 'mobile' | 'desktop') => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rusquiz_view_mode', mode);
    }
  };

  const toggleViewMode = () => {
    const next = viewMode === 'mobile' ? 'desktop' : 'mobile';
    setViewMode(next);
  };

  const refreshUserData = () => {
    const updated = RusQuizStore.getUser();
    setUser(updated);
  };

  const addToast = (message: string, type: ToastMessage['type'] = 'info', xpAmount?: number) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, xpAmount }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const setActiveTab = (tab: AppTab) => {
    if (user.settings?.sound_enabled) {
      playSound('click');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTabState(tab);
  };

  const startQuiz = (
    category?: QuizCategoryKey,
    level?: CEFRLevel,
    isMistakeRetry = false,
    mistakeQuestionIds?: string[]
  ) => {
    setActiveQuizConfig({
      category,
      level,
      isMistakeRetry,
      mistakeQuestionIds,
    });
    setActiveTabState('quiz_session');
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    const updated = {
      ...user,
      settings: {
        ...user.settings,
        dark_mode: next === 'dark',
      },
    };
    setUser(updated);
    RusQuizStore.saveUser(updated);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        activeQuizConfig,
        startQuiz,
        lastQuizResult,
        setLastQuizResult,
        selectedLesson,
        setSelectedLesson,
        toasts,
        addToast,
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        toggleViewMode,
        refreshUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
