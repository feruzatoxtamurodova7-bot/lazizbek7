import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RusQuizStore } from '../services/store';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, Check, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setUser, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Iltimos, to‘g‘ri elektron pochta manzilini kiriting');
      return;
    }

    if (isForgotView) {
      setForgotSent(true);
      addToast('Parolni tiklash havolasi emailingizga yuborildi', 'info');
      setTimeout(() => {
        setIsForgotView(false);
        setForgotSent(false);
      }, 2500);
      return;
    }

    if (authMode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Iltimos, to‘liq ismingizni kiriting');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');
        return;
      }

      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
      const newUser = RusQuizStore.register(fullName, email, username);
      setUser(newUser);
      addToast(`Xush kelibsiz, ${fullName}! Rus tilini o‘rganishni boshlang.`, 'success');
      setIsAuthModalOpen(false);
    } else {
      // Login
      if (!password) {
        setErrorMsg('Parolni kiriting');
        return;
      }

      // Check if admin email or password contains admin
      const isAdmin = email.toLowerCase().includes('admin') || password.toLowerCase().includes('admin');
      const user = RusQuizStore.login(email, password, isAdmin);
      setUser(user);
      addToast(`Xush kelibsiz, ${user.full_name}!`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const handleGoogleAuth = () => {
    // Simulated Google OAuth Flow
    const user = RusQuizStore.getUser();
    user.email = 'feruzatoxtamurodova7@gmail.com';
    user.full_name = 'Feruza To‘xtamurodova';
    RusQuizStore.saveUser(user);
    setUser(user);
    addToast('Google orqali muvaffaqiyatli kirdingiz!', 'success');
    setIsAuthModalOpen(false);
  };

  const handleQuickDemoAdmin = () => {
    const user = RusQuizStore.login('admin@rusquiz.uz', 'admin123', true);
    setUser(user);
    addToast('Administrator huquqi bilan kirildi!', 'success');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#4169E1] to-[#8257E5] flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md shadow-blue-500/20">
            RQ
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isForgotView
              ? 'Parolni tiklash'
              : authMode === 'login'
              ? 'Tizimga kirish'
              : 'Ro‘yxatdan o‘tish'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isForgotView
              ? 'Emailingizni kiriting, tiklash havolasini yuboramiz'
              : authMode === 'login'
              ? 'RusQuiz platformasiga xush kelibsiz!'
              : 'O‘z hisobingizni oching va testlarni boshlang'}
          </p>
        </div>

        {/* Quick Google Auth Button */}
        {!isForgotView && (
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-xs"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google orqali kirish</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 uppercase font-medium">
                yoki email orqali
              </span>
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            </div>
          </div>
        )}

        {/* Form Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {forgotSent && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Tiklash havolasi yuborildi!</span>
          </div>
        )}

        {/* Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && !isForgotView && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                To‘liq ismingiz
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Masalan: Feruza To‘xtamurodova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Elektron pochta (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="misol@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
              />
            </div>
          </div>

          {!isForgotView && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Parol
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotView(true)}
                    className="text-xs text-[#4169E1] hover:underline"
                  >
                    Parolni unutdingizmi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#4169E1] to-[#8257E5] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:opacity-95 active:scale-[0.99] transition-all"
          >
            {isForgotView
              ? 'Tiklash havolasini yuborish'
              : authMode === 'login'
              ? 'Kirish'
              : 'Ro‘yxatdan o‘tish'}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          {isForgotView ? (
            <button
              onClick={() => setIsForgotView(false)}
              className="text-[#4169E1] font-bold hover:underline"
            >
              Kirish oynasiga qaytish
            </button>
          ) : authMode === 'login' ? (
            <p>
              Hisobingiz yo‘qmi?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-[#4169E1] font-bold hover:underline"
              >
                Ro‘yxatdan o‘tish
              </button>
            </p>
          ) : (
            <p>
              Hisobingiz bormi?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-[#4169E1] font-bold hover:underline"
              >
                Kirish
              </button>
            </p>
          )}
        </div>

        {/* Quick Admin Test Shortcut */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Sinov uchun:</span>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <Shield className="w-3 h-3" />
            <span>Admin sifatida kirish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
