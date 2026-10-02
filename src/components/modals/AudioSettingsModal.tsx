import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, X, Sliders, Check, RotateCcw } from 'lucide-react';
import { audioSettings, AudioSettingsState, DEFAULT_AUDIO_SETTINGS } from '../../audio/AudioSettings';
import { audioManager } from '../../audio/AudioManager';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AudioSettingsState>(audioSettings.getState());

  useEffect(() => {
    const unsub = audioSettings.subscribe((next) => {
      setSettings(next);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AudioSettingsState>) => {
    audioSettings.update(partial);
    audioManager.play('button_click');
  };

  const handleReset = () => {
    audioSettings.update(DEFAULT_AUDIO_SETTINGS);
    audioManager.play('toggle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative max-w-md w-full bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white">
              <Sliders className="w-4 h-4 text-[#A8B4C5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Настройки звука (Audio Engine)</h3>
              <p className="text-[11px] text-[#969EAA]">Кастомизация уровней громкости платформы</p>
            </div>
          </div>

          <button
            onClick={() => {
              audioManager.play('button_click');
              onClose();
            }}
            className="p-1 rounded-lg text-[#656D7B] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Toggles */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleUpdate({ soundEnabled: !settings.soundEnabled })}
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              settings.soundEnabled
                ? 'bg-[#191D24] text-white border-white/40'
                : 'bg-[#12151A] text-[#656D7B] border-[#262B34]'
            }`}
          >
            <span>Включить звук</span>
            <div className={`w-3.5 h-3.5 rounded-full ${settings.soundEnabled ? 'bg-[#27C98A]' : 'bg-[#656D7B]'}`} />
          </button>

          <button
            onClick={() => handleUpdate({ isMuted: !settings.isMuted })}
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              settings.isMuted
                ? 'bg-[#EF6262]/20 text-[#EF6262] border-[#EF6262]/40'
                : 'bg-[#12151A] text-white border-[#262B34]'
            }`}
          >
            <span>Без звука (Mute)</span>
            {settings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#969EAA]" />}
          </button>
        </div>

        {/* Volume Sliders */}
        <div className="space-y-4 text-xs">
          {/* Master */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#969EAA]">
              <span>Общая громкость (Master):</span>
              <span className="font-mono-num text-white">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => handleUpdate({ masterVolume: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#191D24] rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* UI */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#969EAA]">
              <span>Звуки интерфейса (UI):</span>
              <span className="font-mono-num text-white">{Math.round(settings.uiVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.uiVolume}
              onChange={(e) => handleUpdate({ uiVolume: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#191D24] rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Case Opening */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#969EAA]">
              <span>Рулетка и открытие кейсов:</span>
              <span className="font-mono-num text-white">{Math.round(settings.caseVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.caseVolume}
              onChange={(e) => handleUpdate({ caseVolume: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#191D24] rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Upgrader */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#969EAA]">
              <span>Звуки Апгрейдера:</span>
              <span className="font-mono-num text-white">{Math.round(settings.upgradeVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.upgradeVolume}
              onChange={(e) => handleUpdate({ upgradeVolume: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#191D24] rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-[#262B34] text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[#969EAA] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить по умолчанию</span>
          </button>

          <button
            onClick={() => {
              audioManager.play('button_click');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-[#E5E5E5] transition-colors"
          >
            Готово
          </button>
        </div>
      </motion.div>
    </div>
  );
};
