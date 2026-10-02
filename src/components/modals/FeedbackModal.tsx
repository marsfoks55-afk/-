import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, X, Send, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';

export const FeedbackModal: React.FC = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen, addToast } = useApp();
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState<'bug' | 'feature' | 'design'>('bug');
  const [isSent, setIsSent] = useState(false);

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    sound.playCoin();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFeedbackText('');
      setIsFeedbackModalOpen(false);
      addToast('success', 'Отзыв отправлен', 'Спасибо за содействие в улучшении Alpha 0.1.1!');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative max-w-md w-full bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Обратная связь Alpha 0.1.1</h3>
              <p className="text-[11px] text-[#969EAA]">Помогите нам протестировать платформу</p>
            </div>
          </div>

          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="p-1 rounded-lg text-[#656D7B] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#969EAA] font-medium">Категория:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bug', label: 'Баг / Ошибка' },
                { id: 'design', label: 'Интерфейс' },
                { id: 'feature', label: 'Идея' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`py-1.5 rounded-lg border text-center transition-colors ${
                    category === c.id
                      ? 'bg-[#191D24] text-white border-white/50 font-semibold'
                      : 'bg-[#12151A] text-[#969EAA] border-[#262B34]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#969EAA] font-medium">Ваше сообщение или баг-репорт:</label>
            <textarea
              required
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Опишите, что работало некорректно или что стоит улучшить..."
              className="w-full bg-[#12151A] border border-[#262B34] rounded-xl p-3 text-xs text-white placeholder-[#656D7B] outline-none focus:border-white/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSent || !feedbackText.trim()}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSent ? <Check className="w-4 h-4 stroke-[3]" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSent ? 'Отправлено' : 'Отправить разработчикам'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
