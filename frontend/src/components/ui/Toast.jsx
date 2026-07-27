import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const VARIANT_CONFIG = {
  success: {
    icon: CheckCircle2,
    bar: 'bg-emerald-500',
    iconClass: 'text-emerald-500',
    border: 'border-gray-200',
    bg: 'bg-white',
  },
  destructive: {
    icon: XCircle,
    bar: 'bg-red-500',
    iconClass: 'text-red-500',
    border: 'border-red-100',
    bg: 'bg-white',
  },
  warning: {
    icon: AlertTriangle,
    bar: 'bg-amber-500',
    iconClass: 'text-amber-500',
    border: 'border-amber-100',
    bg: 'bg-white',
  },
  default: {
    icon: Info,
    bar: 'bg-blue-500',
    iconClass: 'text-blue-500',
    border: 'border-gray-200',
    bg: 'bg-white',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const config = VARIANT_CONFIG[t.variant] || VARIANT_CONFIG.default;
            const Icon = config.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`pointer-events-auto relative flex items-start gap-3 w-full rounded-xl border shadow-lg px-4 py-3.5 overflow-hidden ${config.bg} ${config.border}`}
                role="alert"
              >
                {/* Left color bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar} rounded-l-xl`} />

                <div className="ml-1 flex-shrink-0 mt-0.5">
                  <Icon className={`h-5 w-5 ${config.iconClass}`} aria-hidden="true" />
                </div>

                <div className="flex-1 min-w-0">
                  {t.title && (
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</p>
                  )}
                  {t.description && (
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">{t.description}</p>
                  )}
                </div>

                <button
                  onClick={() => remove(t.id)}
                  className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Named export for cn utility (keep compatibility with existing imports)
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
