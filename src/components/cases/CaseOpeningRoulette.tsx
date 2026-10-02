import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skin, CaseItem, Rarity } from '../../types';
import { SkinImage } from '../ui/SkinImage';
import { audioManager } from '../../audio/AudioManager';
import { Sparkles, RotateCcw, PackageCheck } from 'lucide-react';

interface CaseOpeningRouletteProps {
  caseItem: CaseItem;
  onDropClaim: (skin: Skin) => void;
  onOpenAnother: () => void;
}

const WINNING_INDEX = 48; // Total 60 items, stops at index 48
const CARD_WIDTH = 150;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const ANIMATION_DURATION = 5400; // 5.4s for authentic CS2 deceleration

export const RARITY_COLORS: Record<Rarity, { border: string; glow: string; text: string; bg: string }> = {
  consumer: { border: '#b0c3d9', glow: 'rgba(176, 195, 217, 0.25)', text: 'text-[#b0c3d9]', bg: 'bg-[#b0c3d9]/10' },
  industrial: { border: '#5e98d9', glow: 'rgba(94, 152, 217, 0.3)', text: 'text-[#5e98d9]', bg: 'bg-[#5e98d9]/10' },
  milspec: { border: '#4b69ff', glow: 'rgba(75, 105, 255, 0.35)', text: 'text-[#4b69ff]', bg: 'bg-[#4b69ff]/10' },
  restricted: { border: '#8847ff', glow: 'rgba(136, 71, 255, 0.4)', text: 'text-[#8847ff]', bg: 'bg-[#8847ff]/15' },
  classified: { border: '#d32ce6', glow: 'rgba(211, 44, 230, 0.45)', text: 'text-[#d32ce6]', bg: 'bg-[#d32ce6]/15' },
  covert: { border: '#eb4b4b', glow: 'rgba(235, 75, 75, 0.5)', text: 'text-[#eb4b4b]', bg: 'bg-[#eb4b4b]/20' },
  extraordinary: { border: '#ffd700', glow: 'rgba(255, 215, 0, 0.65)', text: 'text-[#ffd700]', bg: 'bg-[#ffd700]/25' },
};

export const CaseOpeningRoulette: React.FC<CaseOpeningRouletteProps> = ({
  caseItem,
  onDropClaim,
  onOpenAnother,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [reelItems, setReelItems] = useState<Skin[]>([]);
  const [wonSkin, setWonSkin] = useState<Skin | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Easing curve: CS2 uses a smooth cubic-bezier that stays fast then decelerates gradually
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 3.8);
  };

  // Determine winning item mathematically based on case drop odds
  const pickWinner = useCallback((): Skin => {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const drop of caseItem.drops) {
      cumulative += drop.chance;
      if (roll <= cumulative) {
        return drop.skin;
      }
    }
    return caseItem.drops[0].skin;
  }, [caseItem]);

  // Start Opening
  const startSpin = () => {
    if (isSpinning) return;

    audioManager.play('case_open');
    setWonSkin(null);
    setIsSpinning(true);
    setHasStarted(true);

    // 1. Predetermine the winner
    const winner = pickWinner();

    // 2. Build 60 items reel
    const availablePool = caseItem.drops.map((d) => d.skin);
    const generatedReel: Skin[] = [];
    for (let i = 0; i < 60; i++) {
      if (i === WINNING_INDEX) {
        generatedReel.push(winner);
      } else {
        const randomSkin = availablePool[Math.floor(Math.random() * availablePool.length)];
        generatedReel.push(randomSkin);
      }
    }
    setReelItems(generatedReel);

    // 3. Check for prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setWonSkin(winner);
      setIsSpinning(false);
      audioManager.play('roulette_stop');
      audioManager.play(winner.rarity === 'extraordinary' ? 'legendary_drop' : 'item_reveal');
      return;
    }

    // 4. Animate via requestAnimationFrame with exact pixel synchronization
    audioManager.play('roulette_start');

    // Micro-jitter so the needle does not land dead-center identically every spin
    const jitter = (Math.random() - 0.5) * (CARD_WIDTH * 0.55);

    setTimeout(() => {
      if (!containerRef.current || !trackRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const targetCenter = (WINNING_INDEX * CARD_STEP) + (CARD_WIDTH / 2) + jitter;
      const finalTranslateX = targetCenter - (containerWidth / 2);

      const startTime = performance.now();
      let lastPassedIndex = -1;
      let playedSlowdown = false;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / ANIMATION_DURATION);
        const ease = easeOutQuart(progress);
        const currentX = finalTranslateX * ease;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${currentX}px, 0, 0)`;
        }

        // Exact physical synchronization: when card passes center pointer, emit mechanical tick
        const centerOffset = currentX + (containerWidth / 2);
        const currentCardIndex = Math.floor(centerOffset / CARD_STEP);

        if (currentCardIndex !== lastPassedIndex && currentCardIndex >= 0 && currentCardIndex < 60) {
          lastPassedIndex = currentCardIndex;
          // Frequency pitch scales with easing speed for realistic sound texture
          const tickFreq = 700 + (1 - progress) * 350;
          audioManager.play('roulette_tick', { customFreq: tickFreq });
        }

        // Tension sound near stop
        if (progress > 0.88 && !playedSlowdown) {
          playedSlowdown = true;
          audioManager.play('roulette_slowdown');
        }

        if (progress < 1.0) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          // Animation complete
          setIsSpinning(false);
          setWonSkin(winner);

          audioManager.play('roulette_stop');

          if (winner.rarity === 'extraordinary') {
            audioManager.play('legendary_drop');
          } else if (winner.rarity === 'covert' || winner.rarity === 'classified') {
            audioManager.play('rare_drop');
          } else {
            audioManager.play('item_reveal');
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-6 select-none">
      
      {/* Horizontal Roulette Viewport */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-5xl h-56 bg-[#08090B] border border-[#262B34] rounded-2xl overflow-hidden shadow-2xl flex items-center"
      >
        {/* Top & Bottom Center Pointer Needles with High-Tech Glow */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-30 w-1 pointer-events-none flex flex-col justify-between items-center">
          <div className="w-0 h-0 border-x-[8px] border-x-transparent border-t-[14px] border-t-white filter drop-shadow-[0_0_8px_#fff]" />
          <div className="w-0.5 flex-1 bg-white/70 shadow-[0_0_12px_#fff]" />
          <div className="w-0 h-0 border-x-[8px] border-x-transparent border-b-[14px] border-b-white filter drop-shadow-[0_0_8px_#fff]" />
        </div>

        {/* Subtle Horizontal Gradient Fog on Edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#08090B] via-[#08090B]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08090B] via-[#08090B]/80 to-transparent z-20 pointer-events-none" />

        {/* The Track Container */}
        <div
          ref={trackRef}
          className="flex items-center gap-3 px-6 h-full will-change-transform"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {reelItems.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center text-[#969EAA] space-y-2 py-8">
              <Sparkles className="w-8 h-8 opacity-30 text-white" />
              <p className="text-xs">Нажмите кнопку «Открыть кейс (Demo)» для запуска CS2-рулетки</p>
            </div>
          ) : (
            reelItems.map((item, idx) => {
              const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.milspec;
              const isWinner = wonSkin?.id === item.id && idx === WINNING_INDEX;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  style={{ width: `${CARD_WIDTH}px` }}
                  className={`h-44 shrink-0 rounded-xl p-3 flex flex-col justify-between items-center text-center border transition-all duration-300 ${
                    isWinner
                      ? 'border-white bg-[#191D24] shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-105 z-10'
                      : 'border-[#262B34] bg-[#12151A]/90 hover:border-[#3B4252]'
                  }`}
                >
                  {/* Top Wear & Rarity Indicator Bar */}
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="font-mono-num text-[#969EAA]">{item.wear || 'FN'}</span>
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rarityStyle.border, boxShadow: `0 0 8px ${rarityStyle.border}` }}
                    />
                  </div>

                  {/* Weapon Image Slot */}
                  <div className="w-24 h-20 my-1 flex items-center justify-center">
                    <SkinImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      rarity={item.rarity}
                    />
                  </div>

                  {/* Weapon Label */}
                  <div className="w-full leading-tight">
                    <p className="text-[10px] text-[#969EAA] truncate">{item.weapon}</p>
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  </div>

                  {/* Rarity Bottom Stripe */}
                  <div 
                    className="w-full h-1 rounded-full mt-1.5"
                    style={{ backgroundColor: rarityStyle.border }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Result Card when won */}
      <AnimatePresence>
        {wonSkin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            className="w-full max-w-md bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 text-center space-y-4 shadow-2xl"
            style={{ borderColor: RARITY_COLORS[wonSkin.rarity].border }}
          >
            <div className="flex flex-col items-center space-y-1">
              <span 
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: RARITY_COLORS[wonSkin.rarity].bg,
                  color: RARITY_COLORS[wonSkin.rarity].border 
                }}
              >
                РЕЗУЛЬТАТ СИМУЛЯЦИИ: {wonSkin.rarity.toUpperCase()}
              </span>
              <p className="text-xs text-[#969EAA]">Предмет зачислен в локальный демо-инвентарь</p>
            </div>

            <div className="w-48 h-32 mx-auto my-2">
              <SkinImage
                src={wonSkin.image}
                alt={wonSkin.name}
                category={wonSkin.category}
                rarity={wonSkin.rarity}
              />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs text-[#969EAA]">{wonSkin.weapon}</p>
              <h3 className="text-lg font-bold text-white">{wonSkin.name}</h3>
              <p className="text-sm font-mono-num font-semibold text-white pt-1">
                Рыночный ориентир: {wonSkin.price.toFixed(2)} €
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => onDropClaim(wonSkin)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-all flex items-center gap-2 active:scale-95"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Забрать в демо-инвентарь</span>
              </button>

              <button
                onClick={() => {
                  onDropClaim(wonSkin);
                  startSpin();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#12151A] hover:bg-[#191D24] text-white border border-[#262B34] font-semibold text-xs transition-colors flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Открыть ещё раз</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Trigger */}
      {!wonSkin && (
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={startSpin}
            disabled={isSpinning}
            className={`px-10 py-4 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center gap-2.5 ${
              isSpinning
                ? 'bg-[#12151A] text-[#656D7B] border border-[#262B34] cursor-not-allowed opacity-60'
                : 'bg-white text-black hover:bg-[#E5E5E5] shadow-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{isSpinning ? 'Идет вращение рулетки...' : 'Открыть кейс (Demo)'}</span>
          </button>

          <span className="text-[11px] text-[#656D7B]">
            Бесплатный симулятор Alpha 0.2.0 • Демо-режим без списания баланса
          </span>
        </div>
      )}
    </div>
  );
};
