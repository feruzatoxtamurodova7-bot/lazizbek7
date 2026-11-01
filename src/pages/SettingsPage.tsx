import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Volume2,
  Bell,
  Lock,
  Database,
  Trash2,
  LogOut,
  Check,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser, theme, toggleTheme, addToast, setIsAuthModalOpen, setAuthMode } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(user.settings?.sound_enabled ?? true);
  const [timerEnabled, setTimerEnabled] = useState(user.settings?.timer_enabled ?? true);
  const [notifications, setNotifications] = useState(user.settings?.email_notifications ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Supabase Settings
  const [supabaseConfig, setSupabaseConfig] = useState(() => RusQuizStore.getSupabaseConfig());
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.anonKey || '');

  const handleSavePreferences = () => {
    const updated = RusQuizStore.updateUserProfile({
      settings: {
        ...user.settings,
        sound_enabled: soundEnabled,
        timer_enabled: timerEnabled,
        email_notifications: notifications,
      },
    });
    setUser(updated);
    addToast('Sozlamalar saqlandi!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      addToast('Yangi parollar bir-biriga mos kelmadi', 'error');
      return;
    }
    addToast('Parol muvaffaqiyatli o‘zgartirildi!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    RusQuizStore.saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    setSupabaseConfig(RusQuizStore.getSupabaseConfig());
    addToast(
      supabaseUrl && supabaseKey
        ? 'Supabase integratsiyasi sozlandi!'
        : 'Mahalliy xotiraga ulanish saqlandi',
      'success'
    );
  };

  const handleResetData = () => {
    if (confirm('Barcha test natijalari va xotira boshlang‘ich holatga qaytarilsinmi?')) {
      RusQuizStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Tizim sozlamalari
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ilova ko‘rinishi, bildirishnomalar va shaxsiy xavfsizlik parametrlari
        </p>
      </div>

      {/* General & Theme Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ilova ko‘rinishi va ovoz
        </h3>

        {/* Theme */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-purple-500" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Mavzu (Theme)
              </span>
              <span className="text-xs text-slate-500">
                {theme === 'dark' ? 'Qorong‘u rejim yoqilgan' : 'Yorug‘ rejim yoqilgan'}
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
          </button>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#4169E1]" />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Ovozli signallar va audio talaffuz
              </span>
              <span className="text-xs text-slate-500">
                Test yechishda javob tovushlari va so‘zlar audio talaffuzi
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => {
              setSoundEnabled(e.target.checked);
              handleSavePreferences();
            }}
            className="w-5 h-5 rounded-md text-[#4169E1] accent-[#4169E1] cursor-pointer"
          />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Test vaqt hisoblagichi (30 soniya)
              </span>
              <span className="text-xs text-slate-500">
                Savollarga javob berishda vaqt chegarasini yoqish
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => {
              setTimerEnabled(e.target.checked);
              handleSavePreferences();
            }}
            className="w-5 h-5 rounded-md text-[#4169E1] accent-[#4169E1] cursor-pointer"
          />
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Parolni o‘zgartirish</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hozirgi parol
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Yangi parol
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Yangi parolni takrorlang
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold transition-colors"
          >
            Parolni yangilash
          </button>
        </form>
      </div>

      {/* Supabase Integration Configuration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Supabase ma’lumotlar bazasi integratsiyasi</span>
          </h3>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              supabaseConfig.isConnected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60'
                : 'bg-blue-100 text-[#4169E1] dark:bg-blue-950/60'
            }`}
          >
            {supabaseConfig.isConnected ? '✓ Supabase ulangan' : 'Mahalliy rejim (Lokal xotira)'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ilova barcha ma’lumotlarni avtomatik tarzda xavfsiz saqlaydi. Istasangiz, shaxsiy
          Supabase loyihangiz kalitlarini kiritishingiz mumkin.
        </p>

        <form onSubmit={handleSaveSupabase} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Anon Public Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#4169E1] hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Integratsiya parametrlarini saqlash
          </button>
        </form>
      </div>

      {/* Account Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
        <h3 className="text-base font-bold text-rose-700 dark:text-rose-400">
          Hisob xavfsizligi va tozalash
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
              Boshqa hisobga o‘tish yoki chiqish
            </span>
            <span className="text-xs text-slate-500">
              Joriy hisobdan chiqib, yangi o‘quvchi hisobini ochish
            </span>
          </div>
          <button
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-rose-200/60 dark:border-rose-900/40">
          <div>
            <span className="text-sm font-bold text-rose-700 dark:text-rose-400 block">
              Barcha natijalarni tozalash (Reset)
            </span>
            <span className="text-xs text-slate-500">
              XP, streak, urinishlar va xatolar kitobini boshlang‘ich holatga qaytaradi
            </span>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Natijalarni tozalash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
