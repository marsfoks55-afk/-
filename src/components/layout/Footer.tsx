import React from 'react';
import { ShieldAlert, Lock, FileText, HelpCircle, Code2, Mail, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';

export const Footer: React.FC = () => {
  const { setActivePage, setIsFeedbackModalOpen } = useApp();

  const handleLink = (page: any) => {
    sound.playClick();
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08090B] border-t border-[#262B34] text-xs text-[#969EAA] py-12 px-4 sm:px-6 select-none mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#12151A] border border-[#262B34] flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
            <span className="font-bold text-sm tracking-wider text-white">CASER.GG</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-num font-semibold bg-[#12151A] border border-[#262B34] text-[#E5B84D]">
              ALPHA 0.1.1
            </span>
          </div>

          <p className="text-xs text-[#969EAA] leading-relaxed max-w-md">
            Независимый интерфейс анализа вероятностей и симуляции предметов CS2. В текущей версии проводятся испытания интерфейса и анимационной системы без финансовых операций.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#656D7B] pt-1">
            <span className="flex items-center gap-1.5 text-[#E5B84D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B84D]" />
              System Status: Alpha Sandbox (No Real Money)
            </span>
            <span>Build: 0.1.1-hardened</span>
          </div>
        </div>

        {/* Documentation */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Документация
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => handleLink('terms')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#656D7B]" />
                Условия использования
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('privacy')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#656D7B]" />
                Конфиденциальность
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('faq')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#656D7B]" />
                Часто задаваемые вопросы (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('changelog')} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#656D7B]" />
                Журнал изменений (Changelog)
              </button>
            </li>
          </ul>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Платформа
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => handleLink('cases')} className="hover:text-white transition-colors">
                Кейсы (Demo Simulator)
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('upgrader')} className="hover:text-white transition-colors">
                Апгрейдер (Demo Simulator)
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('market')} className="hover:text-white transition-colors">
                Каталог предметов
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  sound.playClick();
                  setIsFeedbackModalOpen(true);
                }} 
                className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-300 font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#E5B84D]" />
                <span>Отправить отзыв (Feedback)</span>
              </button>
            </li>
            <li>
              <a 
                href="/caser-project.zip" 
                download="caser-project.zip" 
                className="hover:text-white transition-colors text-white font-medium flex items-center gap-1 pt-1"
              >
                <span>📦 Исходный ZIP проекта</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#262B34] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#656D7B]">
        <p>
          © 2026 CASER.GG. Counter-Strike 2 и CS2 являются зарегистрированными товарными знаками Valve Corporation. Продукт находится в стадии раннего доступа Alpha 0.1.1 без реальных ставок.
        </p>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" />
          <span>alpha-desk@caser.gg</span>
        </div>
      </div>
    </footer>
  );
};
