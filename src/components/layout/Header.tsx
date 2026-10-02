import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  History, 
  User, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  ChevronDown,
  Download,
  LogIn,
  MessageSquare,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId, Currency } from '../../types';
import { audioSettings, AudioSettingsState } from '../../audio/AudioSettings';
import { audioManager } from '../../audio/AudioManager';

export const Header: React.FC = () => {
  const {
    walletBalance,
    currency,
    setCurrency,
    formatPrice,
    activePage,
    setActivePage,
    language,
    setLanguage,
    setIsDepositModalOpen,
    setIsAuthModalOpen,
    setIsFeedbackModalOpen,
    setIsAudioSettingsOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [audioState, setAudioState] = useState<AudioSettingsState>(audioSettings.getState());

  useEffect(() => {
    return audioSettings.subscribe((s) => setAudioState(s));
  }, []);

  const navItems: { id: PageId; labelRu: string; labelEn: string }[] = [
    { id: 'home', labelRu: 'Главная', labelEn: 'Home' },
    { id: 'cases', labelRu: 'Кейсы (50)', labelEn: 'Cases (50)' },
    { id: 'upgrader', labelRu: 'Апгрейдер', labelEn: 'Upgrader' },
    { id: 'market', labelRu: 'Каталог', labelEn: 'Catalog' },
    { id: 'inventory', labelRu: 'Инвентарь', labelEn: 'Inventory' },
    { id: 'history', labelRu: 'Аудит', labelEn: 'Audit' },
  ];

  const handleNavClick = (pageId: PageId) => {
    audioManager.play('button_click');
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  const isAudioActive = audioState.soundEnabled && !audioState.isMuted;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090B]/90 backdrop-blur-xl border-b border-[#262B34] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#12151A] border border-[#262B34] group-hover:border-white/40 flex items-center justify-center transition-colors">
              <span className="text-sm font-bold text-white tracking-tighter">C</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold tracking-wider text-base text-[#F4F5F7]">
                CASER<span className="text-[#969EAA] font-normal text-xs">.GG</span>
              </span>
              <span className="text-[10px] text-[#27C98A] font-mono-num font-semibold">α 0.2.0</span>
            </div>
          </div>

          {/* Alpha 0.2.0 Status Marker */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#12151A] border border-[#262B34] text-[10px] text-[#969EAA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27C98A]" />
            <span>50 CUSTOM CASES • AUDIO ENGINE</span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#969EAA]">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-white'
                    : 'hover:text-white'
                }`}
              >
                {language === 'ru' ? item.labelRu : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Controls, Sound Manager, Balance, Steam Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Currency Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                audioManager.play('button_click');
                setCurrencyDropdownOpen(!currencyDropdownOpen);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12151A] border border-[#262B34] text-xs font-medium text-[#969EAA] hover:text-white transition-colors"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-[#656D7B]" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-[#12151A] border border-[#262B34] rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
                {(['EUR', 'USD', 'UAH'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      audioManager.play('button_click');
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                      currency === c ? 'bg-[#191D24] text-white font-bold' : 'text-[#969EAA] hover:bg-[#191D24] hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Settings Control with Visual Indicator */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                audioSettings.toggleMute();
                audioManager.play('toggle');
              }}
              title={isAudioActive ? `Звук включен (${Math.round(audioState.masterVolume * 100)}%)` : 'Без звука (Muted)'}
              className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                isAudioActive
                  ? 'bg-[#12151A] border-[#262B34] text-white hover:border-white/40'
                  : 'bg-[#12151A] border-[#262B34] text-[#656D7B] hover:text-white'
              }`}
            >
              {isAudioActive ? (
                <Volume2 className="w-3.5 h-3.5 text-[#27C98A]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#EF6262]" />
              )}
            </button>

            <button
              onClick={() => {
                audioManager.play('button_click');
                setIsAudioSettingsOpen(true);
              }}
              title="Настройки громкости (Master / UI / Cases / Upgrader)"
              className="p-2 rounded-lg bg-[#12151A] border border-[#262B34] text-[#969EAA] hover:text-white transition-colors hidden sm:flex items-center justify-center"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feedback Button */}
          <button
            onClick={() => {
              audioManager.play('button_click');
              setIsFeedbackModalOpen(true);
            }}
            title="Отправить отзыв"
            className="p-2 rounded-lg bg-[#12151A] border border-[#262B34] text-[#969EAA] hover:text-white transition-colors hidden sm:flex items-center justify-center"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* Download Project ZIP */}
          <a
            href="/caser-project.zip"
            download="caser-project.zip"
            title="Скачать полный ZIP проекта"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12151A] border border-[#262B34] hover:border-white/30 text-xs font-medium text-[#969EAA] hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ZIP</span>
          </a>

          {/* Honest Balance Pill: €0.00 */}
          <div 
            onClick={() => {
              audioManager.play('button_click');
              setIsDepositModalOpen(true);
            }}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1 rounded-lg bg-[#12151A] border border-[#262B34] hover:border-[#3B4252] cursor-pointer transition-colors group"
          >
            <div className="flex flex-col text-right leading-none">
              <span className="text-[9px] text-[#656D7B] font-medium tracking-tight uppercase">
                WALLET (ALPHA)
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#F4F5F7] font-mono-num mt-0.5">
                {formatPrice(walletBalance)}
              </span>
            </div>
          </div>

          {/* Steam Auth Button - Honest Coming Soon */}
          <button
            onClick={() => {
              audioManager.play('button_click');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Steam Login</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#12151A] border border-[#262B34] text-[#969EAA] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0F13] border-b border-[#262B34] px-4 py-4 space-y-2 animate-fade-in text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left ${
                activePage === item.id ? 'bg-[#191D24] text-white font-semibold' : 'text-[#969EAA]'
              }`}
            >
              <span>{language === 'ru' ? item.labelRu : item.labelEn}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-[#262B34] flex items-center justify-between text-[11px] text-[#969EAA]">
            <button
              onClick={() => setIsAudioSettingsOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#12151A] border border-[#262B34]"
            >
              <Sliders className="w-3 h-3" />
              <span>Звук ({Math.round(audioState.masterVolume * 100)}%)</span>
            </button>
            <button
              onClick={() => setCurrency(currency === 'EUR' ? 'USD' : currency === 'USD' ? 'UAH' : 'EUR')}
              className="px-2.5 py-1 rounded bg-[#12151A] border border-[#262B34]"
            >
              Валюта: {currency}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
