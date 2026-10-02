import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, PackageCheck, RotateCcw, X, Trash2 } from 'lucide-react';
import { Skin } from '../../types';
import { useApp } from '../../context/AppContext';
import { SkinImage } from '../ui/SkinImage';
import { sound } from '../../utils/sound';

interface UpgradeResultModalProps {
  result: {
    won: boolean;
    skin: Skin;
    chance: number;
  } | null;
  onClose: () => void;
  onContinueUpgrade: () => void;
}

export const UpgradeResultModal: React.FC<UpgradeResultModalProps> = ({
  result,
  onClose,
  onContinueUpgrade,
}) => {
  const { formatPrice, addDemoInventoryItem, addToast } = useApp();

  useEffect(() => {
    if (result?.won) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#A8B4C5', '#27C98A'],
      });
    }
  }, [result]);

  if (!result) return null;

  const { won, skin, chance } = result;

  const handleClaim = () => {
    sound.playCoin();
    addDemoInventoryItem(skin, 'upgrader');
    onClose();
    addToast('success', 'Сохранено в сессию', `${skin.weapon} | ${skin.name} добавлен в демо-инвентарь`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#12151A] text-[#969EAA] hover:text-white border border-[#262B34] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Badge */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          {won ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#27C98A]/15 text-[#27C98A] border border-[#27C98A]/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">
                Симуляция: Успех
              </h2>
              <span className="text-xs text-[#969EAA]">
                Стрелка попала в сектор (расчетный шанс: <strong className="text-white font-mono-num">{chance.toFixed(2)}%</strong>)
              </span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#EF6262]/15 text-[#EF6262] border border-[#EF6262]/30 flex items-center justify-center">
                <XCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">
                Симуляция: Неудача
              </h2>
              <span className="text-xs text-[#969EAA]">
                Стрелка остановилась вне сектора (шанс был: <strong className="text-white font-mono-num">{chance.toFixed(2)}%</strong>)
              </span>
            </>
          )}
        </div>

        {/* Item Card */}
        <div className="bg-[#12151A] border border-[#262B34] rounded-2xl p-5 flex flex-col items-center">
          <div className="w-44 h-28 my-2">
            <SkinImage
              src={skin.image}
              alt={skin.name}
              category={skin.category}
              rarity={skin.rarity}
              className={won ? '' : 'grayscale opacity-30'}
            />
          </div>

          <p className="text-xs text-[#969EAA]">{skin.weapon}</p>
          <h3 className="text-base font-bold text-white">{skin.name}</h3>
          <p className="text-sm font-mono-num font-semibold text-white pt-1">
            Рыночный эквивалент: {formatPrice(skin.price)}
          </p>
        </div>

        {/* Action Buttons */}
        {won ? (
          <div className="space-y-2 text-xs font-semibold">
            <button
              onClick={handleClaim}
              className="w-full py-3 rounded-xl bg-white text-black hover:bg-[#E5E5E5] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Сохранить в демо-инвентарь</span>
            </button>

            <button
              onClick={() => {
                handleClaim();
                onContinueUpgrade();
              }}
              className="w-full py-2 text-[#969EAA] hover:text-white transition-colors flex items-center justify-center gap-1 font-normal"
            >
              <span>Продолжить симуляцию с этим скином</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#12151A] hover:bg-[#191D24] border border-[#262B34] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Попробовать снова</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
