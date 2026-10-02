import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, X, ExternalLink, Clock, Server, Code2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';

export const SteamAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useApp();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12151A] border border-[#262B34] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5l2.6-3.8A4.98 4.98 0 0 1 11 15c0-1.4.6-2.6 1.5-3.5L11 8.2A5 5 0 1 1 16 13l-3.3 2.3c0 .2 0 .5-.1.7l3.8 2.6A10 10 0 0 0 12 2z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F5F7] tracking-tight">Steam OpenID Авторизация</h3>
              <p className="text-[11px] text-[#E5B84D] font-mono-num font-semibold">STATUS: COMING SOON</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsAuthModalOpen(false);
            }}
            className="p-1 rounded-lg text-[#656D7B] hover:text-[#F4F5F7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Honest Architectural Status */}
        <div className="bg-[#12151A] border border-[#262B34] rounded-xl p-4 text-xs space-y-3 text-[#969EAA] leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Server className="w-4 h-4 text-[#A8B4C5]" />
            <span>Требуется серверная верификация Valve</span>
          </div>
          <p className="text-[11px]">
            В версии <strong>Alpha 0.1.1</strong> мы удалили создание фиктивных профилей и случайных Steam ID. Реальный вход через Steam OpenID 2.0 требует выделенного бэкенда для криптографической валидации ответа от серверов <code>steamcommunity.com</code>.
          </p>
        </div>

        {/* Roadmap Items */}
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-[#656D7B] font-semibold uppercase tracking-wider">
            План внедрения (Alpha 0.2.0):
          </p>
          <div className="space-y-1.5 text-[11px] text-[#969EAA]">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#12151A]/60 border border-[#262B34]">
              <Clock className="w-3.5 h-3.5 text-[#E5B84D] shrink-0" />
              <span>Серверный эндпоинт <code>/api/auth/steam/callback</code></span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#12151A]/60 border border-[#262B34]">
              <Code2 className="w-3.5 h-3.5 text-[#E5B84D] shrink-0" />
              <span>Защищенные HttpOnly Cookie сессии без хранения паролей</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-1">
          <button
            onClick={() => {
              sound.playClick();
              setIsAuthModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-[#191D24] hover:bg-[#20252E] text-white border border-[#262B34] font-semibold text-xs transition-colors"
          >
            Понятно, продолжить в демо-режиме
          </button>
        </div>
      </motion.div>
    </div>
  );
};
