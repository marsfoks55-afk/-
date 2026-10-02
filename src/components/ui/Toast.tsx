import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-[#27C98A] shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-[#EF6262] shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-[#E5B84D] shrink-0" />,
            info: <Info className="w-4 h-4 text-[#A8B4C5] shrink-0" />,
          };

          const borders = {
            success: 'border-[#27C98A]/30',
            error: 'border-[#EF6262]/30',
            warning: 'border-[#E5B84D]/30',
            info: 'border-[#262B34]',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto bg-[#12151A]/95 backdrop-blur-xl border ${borders[toast.type]} rounded-xl p-3.5 shadow-2xl flex items-start justify-between gap-3 text-xs`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{icons[toast.type]}</div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#F4F5F7] leading-tight">{toast.title}</p>
                  {toast.message && (
                    <p className="text-[11px] text-[#969EAA] leading-relaxed">{toast.message}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#656D7B] hover:text-[#F4F5F7] p-1 rounded-md transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
