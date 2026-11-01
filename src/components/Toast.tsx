import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/80';
        } else if (toast.type === 'xp') {
          icon = <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />;
          borderClass = 'border-amber-300 dark:border-amber-700 bg-amber-50/95 dark:bg-amber-950/90';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-200 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/80';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-top-3 ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {toast.message}
                {toast.xpAmount && (
                  <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                    +{toast.xpAmount} XP
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
