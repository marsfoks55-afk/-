import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  X, 
  Clock, 
  Lock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Currency } from '../../types';
import { sound } from '../../utils/sound';

export const DepositModal: React.FC = () => {
  const { 
    isDepositModalOpen, 
    setIsDepositModalOpen, 
    currency, 
    setCurrency, 
    formatPrice,
    addToast
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'cards' | 'wallets' | 'sepa' | 'local'>('cards');

  if (!isDepositModalOpen) return null;

  const handleClose = () => {
    sound.playClick();
    setIsDepositModalOpen(false);
  };

  const handleNotifyMe = () => {
    sound.playClick();
    setIsDepositModalOpen(false);
    addToast('info', 'Статус сохранен', 'Мы уведомим вас при открытии реального платёжного шлюза в Beta.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative max-w-lg w-full bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262B34]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">PAYMENT GATEWAY</h2>
              <span className="px-2 py-0.5 rounded-full border text-[10px] font-mono-num font-semibold bg-[#12151A] text-[#E5B84D] border-[#262B34]">
                STATUS: IN DEVELOPMENT
              </span>
            </div>
            <p className="text-xs text-[#969EAA]">
              Интеграция платёжного шлюза для Alpha 0.2.0
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-[#12151A] text-[#969EAA] hover:text-white border border-[#262B34] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#12151A] border border-[#262B34] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#969EAA] leading-relaxed">
          <Lock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Реальные платежи отключены:</span><br />
            В релизе <strong>Alpha 0.1.1</strong> финансовые транзакции заблокированы. Мы не принимаем банковские карты и не имитируем зачисление фиатных средств.
          </div>
        </div>

        {/* Currency Toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#969EAA]">Планируемые валюты счёта:</span>
          <div className="flex gap-1 bg-[#12151A] p-1 rounded-xl border border-[#262B34]">
            {(['EUR', 'USD', 'UAH'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  sound.playClick();
                  setCurrency(c);
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  currency === c
                    ? 'bg-[#191D24] text-white border border-[#262B34]'
                    : 'text-[#969EAA] hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Planned Payment Channels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 opacity-80">
          {[
            { id: 'cards', label: 'Банк. карты', sub: 'Visa / MC', icon: CreditCard },
            { id: 'wallets', label: 'Apple / Google', sub: 'One-Tap', icon: Smartphone },
            { id: 'sepa', label: 'SEPA Direct', sub: 'EU Instant', icon: Building2 },
            { id: 'local', label: 'UAH IBAN', sub: 'Приват / Моно', icon: Building2 },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMethod(m.id as any);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-[#12151A] border-white/40 text-white'
                    : 'bg-[#12151A]/50 border-[#262B34] text-[#969EAA]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-white">{m.label}</p>
                  <p className="text-[10px] text-[#969EAA]">{m.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Information box */}
        <div className="p-3 rounded-xl bg-[#12151A]/60 border border-[#262B34] text-xs text-[#969EAA] space-y-1">
          <p className="text-white font-medium">Бесплатный режим симулятора:</p>
          <p className="text-[11px]">
            Вы можете бесплатно тестировать кейсы и апгрейдер без необходимости пополнения кошелька.
          </p>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={handleNotifyMe}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-2"
          >
            <span>Понятно, вернуться к симулятору</span>
          </button>
        </div>
      </div>
    </div>
  );
};
