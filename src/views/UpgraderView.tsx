import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Plus, 
  ArrowUpDown, 
  Search, 
  Package, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Skin, UserInventoryItem } from '../types';
import { SKINS_DATABASE } from '../data/skins';
import { SkinImage } from '../components/ui/SkinImage';
import { sound } from '../utils/sound';

interface UpgraderViewProps {
  onUpgradeResult: (res: { won: boolean; skin: Skin; chance: number } | null) => void;
}

export const UpgraderView: React.FC<UpgraderViewProps> = ({ onUpgradeResult }) => {
  const {
    demoInventory,
    formatPrice,
    executeUpgradeSimulation,
    addToast,
  } = useApp();

  // Selected input items from demo inventory (or catalog picker)
  const [selectedInputItems, setSelectedInputItems] = useState<UserInventoryItem[]>([]);
  
  // Selected target item
  const [targetSkin, setTargetSkin] = useState<Skin | null>(
    SKINS_DATABASE.find((s) => s.id === 'huntsman_lore') || SKINS_DATABASE[0]
  );

  // Catalog tab & filters
  const [catalogTab, setCatalogTab] = useState<'all' | 'inventory'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  // Wheel animation states
  const [isRolling, setIsRolling] = useState(false);
  const [currentNeedleAngle, setCurrentNeedleAngle] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  // Math Calculations:
  const inputSkinsValue = selectedInputItems.reduce((acc, item) => acc + item.price, 0);

  // Mathematically safe chance calculation:
  // RTP = 95%
  // Capped at 85% maximum chance, minimum 0.05%
  const calculatedChance = useMemo(() => {
    if (!targetSkin || targetSkin.price <= 0 || inputSkinsValue <= 0) {
      return 0;
    }
    const raw = (inputSkinsValue / targetSkin.price) * 95;
    if (isNaN(raw) || !isFinite(raw)) return 0;
    return Math.min(85, Math.max(0.05, raw));
  }, [inputSkinsValue, targetSkin]);

  // Status helper
  const getChanceDescription = (chance: number) => {
    if (chance <= 0) return 'Выберите исходные демо-предметы и цель';
    if (chance < 15) return 'Высокий риск (Low chance)';
    if (chance < 35) return 'Умеренный риск';
    if (chance < 65) return 'Сбалансированный шанс';
    return 'Высокая вероятность успеха';
  };

  // SVG Gauge calculations
  const radius = 100;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedChance / 100) * circumference;

  // Toggle input items
  const handleToggleInputItem = (item: UserInventoryItem | Skin) => {
    sound.playClick();
    
    // Convert catalog skin to demo inventory item if picked from 'all'
    const instance: UserInventoryItem = 'instanceId' in item
      ? (item as UserInventoryItem)
      : {
          ...item,
          instanceId: `sim-pick-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          acquiredAt: Date.now(),
          acquiredFrom: 'starter',
        };

    setSelectedInputItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && ('instanceId' in item ? i.instanceId === (item as UserInventoryItem).instanceId : true));
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        if (prev.length >= 6) {
          addToast('warning', 'Ограничение слотов', 'Максимум 6 предметов в одной симуляции');
          return prev;
        }
        return [...prev, instance];
      }
    });
  };

  const handleRemoveInput = (instanceId: string) => {
    sound.playClick();
    setSelectedInputItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
  };

  // Quick multipliers (x2, x3, x5, 35%, 50%, 75%)
  const handlePresetMultiplier = (mult: number, exactPct?: number) => {
    sound.playClick();
    const effectiveBet = inputSkinsValue > 0 ? inputSkinsValue : 25.0;

    let targetPrice = effectiveBet * mult;
    if (exactPct) {
      targetPrice = (effectiveBet / exactPct) * 95;
    }

    let closest = SKINS_DATABASE[0];
    let minDiff = Infinity;
    for (const skin of SKINS_DATABASE) {
      const diff = Math.abs(skin.price - targetPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closest = skin;
      }
    }
    setTargetSkin(closest);
  };

  // Execute Simulation
  const handleUpgradeClick = async () => {
    if (isRolling || !targetSkin || inputSkinsValue <= 0 || calculatedChance <= 0) return;

    sound.playClick();
    setIsRolling(true);

    const willWin = await executeUpgradeSimulation(
      selectedInputItems,
      targetSkin,
      calculatedChance
    );

    const winDegrees = (calculatedChance / 100) * 360;
    let targetAngleInCircle: number;

    if (willWin) {
      const margin = Math.min(8, winDegrees * 0.1);
      targetAngleInCircle = margin + Math.random() * Math.max(1, winDegrees - margin * 2);
    } else {
      const remaining = 360 - winDegrees;
      const margin = Math.min(8, remaining * 0.1);
      targetAngleInCircle = winDegrees + margin + Math.random() * Math.max(1, remaining - margin * 2);
    }

    const totalRotation = 360 * 5 + targetAngleInCircle;
    const startAngle = currentNeedleAngle % 360;
    const startTime = performance.now();
    const duration = 3800;

    let lastTick = startAngle;

    const animateNeedle = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3.5);
      const angle = startAngle + totalRotation * ease;
      setCurrentNeedleAngle(angle);

      if (Math.abs(angle - lastTick) >= 15) {
        lastTick = angle;
        sound.playTick(500 + (1 - progress) * 300, 0.015);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateNeedle);
      } else {
        setIsRolling(false);
        if (willWin) {
          sound.playWin();
          addToast('success', 'Симуляция: Успех!', `${targetSkin.weapon} | ${targetSkin.name}`);
        } else {
          sound.playLoss();
          addToast('error', 'Симуляция: Неудача', 'Стрелка остановилась вне выигрышного сектора');
        }

        onUpgradeResult({
          won: willWin,
          skin: targetSkin,
          chance: calculatedChance,
        });
        setSelectedInputItems([]);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateNeedle);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Filter Catalog Items
  const filteredCatalogItems = useMemo(() => {
    const list = catalogTab === 'all' ? SKINS_DATABASE : demoInventory;
    return list
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches = item.name.toLowerCase().includes(q) || item.weapon.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
  }, [catalogTab, demoInventory, selectedCategory, searchQuery, sortAsc]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B34]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">CS2 UPGRADER</h1>
            <span className="text-[10px] font-mono-num font-semibold text-[#E5B84D] bg-[#12151A] px-2 py-0.5 rounded-full border border-[#262B34]">
              FREE SIMULATOR • ALPHA 0.1.1
            </span>
          </div>
          <p className="text-xs text-[#969EAA] mt-0.5">
            Математическая модель вероятностей апгрейдов CS2 без списания реальных денежных средств
          </p>
        </div>

        {/* Multiplier Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'x2', mult: 2 },
            { label: 'x3', mult: 3 },
            { label: 'x5', mult: 5 },
            { label: '35%', mult: 0, pct: 35 },
            { label: '50%', mult: 0, pct: 50 },
            { label: '75%', mult: 0, pct: 75 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetMultiplier(preset.mult, preset.pct)}
              className="px-2.5 py-1.5 rounded-lg bg-[#12151A] hover:bg-[#191D24] border border-[#262B34] text-xs font-medium text-[#969EAA] hover:text-white transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrader Main Stage: 3-column architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Input Selection */}
        <div className="lg:col-span-4 bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262B34] mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Исходные предметы ({selectedInputItems.length})
              </span>
              {selectedInputItems.length > 0 && (
                <button
                  onClick={() => setSelectedInputItems([])}
                  className="text-[11px] text-[#969EAA] hover:text-[#EF6262] transition-colors"
                >
                  Очистить
                </button>
              )}
            </div>

            {/* Selected Items List */}
            <div className="space-y-2 min-h-[170px] max-h-[220px] overflow-y-auto pr-1">
              {selectedInputItems.length === 0 ? (
                <div className="h-40 rounded-xl border border-dashed border-[#262B34] flex flex-col items-center justify-center text-center p-4 text-[#969EAA]">
                  <Package className="w-8 h-8 opacity-30 mb-2" />
                  <p className="text-xs">Выберите предметы из каталога снизу для теста</p>
                </div>
              ) : (
                selectedInputItems.map((item) => (
                  <div
                    key={item.instanceId}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#12151A] border border-[#262B34] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-8">
                        <SkinImage
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          rarity={item.rarity}
                        />
                      </div>
                      <div className="leading-tight">
                        <p className="text-white font-medium truncate max-w-[120px]">{item.name}</p>
                        <p className="text-[10px] text-[#969EAA]">{item.weapon}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono-num font-semibold text-white">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => handleRemoveInput(item.instanceId)}
                        className="p-1 rounded text-[#969EAA] hover:text-[#EF6262] hover:bg-[#191D24] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Value Indicator */}
          <div className="pt-4 border-t border-[#262B34] mt-4 flex items-center justify-between text-xs">
            <span className="text-[#969EAA]">Оценка исходных скинов:</span>
            <span className="font-mono-num font-bold text-white text-sm">
              {formatPrice(inputSkinsValue)}
            </span>
          </div>
        </div>

        {/* Center: Circular Gauge Wheel & Action */}
        <div className="lg:col-span-4 bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
          
          {/* Circular Wheel Gauge */}
          <div className="relative w-60 h-60 flex items-center justify-center select-none">
            <svg className="w-56 h-56 -rotate-90 transform overflow-visible">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-[#191D24]"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {calculatedChance > 0 && (
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-white transition-all duration-300"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              )}
            </svg>

            {/* Rotating Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `rotate(${currentNeedleAngle - 90}deg)`,
                transition: isRolling ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              <div className="absolute left-[14px] flex items-center">
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[12px] border-l-white" />
              </div>
            </div>

            {/* Center Readout */}
            <div className="absolute flex flex-col items-center justify-center text-center p-2">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono-num">
                {calculatedChance.toFixed(2)}%
              </span>
              <span className="text-[11px] text-[#969EAA] font-medium mt-1 max-w-[140px] leading-tight">
                {getChanceDescription(calculatedChance)}
              </span>
            </div>
          </div>

          {/* Action Upgrade Button */}
          <button
            onClick={handleUpgradeClick}
            disabled={isRolling || !targetSkin || inputSkinsValue <= 0 || calculatedChance <= 0}
            className={`w-full max-w-[240px] py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-lg active:scale-95 ${
              isRolling || !targetSkin || inputSkinsValue <= 0 || calculatedChance <= 0
                ? 'bg-[#12151A] text-[#656D7B] border border-[#262B34] cursor-not-allowed opacity-50'
                : 'bg-white text-black hover:bg-[#E5E5E5] shadow-white/5'
            }`}
          >
            {isRolling ? 'Симуляция вращения...' : 'Запустить Демо-Апгрейд'}
          </button>
        </div>

        {/* Right: Target Item Preview */}
        <div className="lg:col-span-4 bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262B34] mb-3">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Целевой скин
              </span>
              {targetSkin && (
                <span className="text-[10px] uppercase font-mono-num text-[#969EAA] bg-[#12151A] px-2 py-0.5 rounded border border-[#262B34]">
                  {targetSkin.rarity}
                </span>
              )}
            </div>

            {targetSkin ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-48 h-36 flex items-center justify-center mb-2">
                  <SkinImage
                    src={targetSkin.image}
                    alt={targetSkin.name}
                    category={targetSkin.category}
                    rarity={targetSkin.rarity}
                  />
                </div>

                <p className="text-xs text-[#969EAA] font-medium">{targetSkin.weapon}</p>
                <h3 className="text-base font-bold text-white">{targetSkin.name}</h3>

                <div className="mt-3 px-3 py-1 rounded-lg bg-[#12151A] border border-[#262B34] text-xs font-mono-num font-semibold text-white">
                  Эквивалент: {formatPrice(targetSkin.price)}
                </div>
              </div>
            ) : (
              <div className="h-48 rounded-xl border border-dashed border-[#262B34] flex flex-col items-center justify-center text-center p-4 text-[#969EAA]">
                <p className="text-xs">Выберите предмет из каталога снизу, на который хотите улучшиться</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#262B34] text-center text-[11px] text-[#969EAA]">
            {targetSkin && inputSkinsValue > 0 ? (
              <span>Множитель цели: <strong className="text-white font-mono-num">x{(targetSkin.price / inputSkinsValue).toFixed(2)}</strong></span>
            ) : (
              <span>Выберите исходный и целевой скин для расчёта</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Unified Catalog */}
      <section className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#262B34]">
          <div className="flex items-center gap-1 bg-[#12151A] p-1 rounded-xl border border-[#262B34]">
            <button
              onClick={() => { sound.playClick(); setCatalogTab('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                catalogTab === 'all'
                  ? 'bg-[#191D24] text-white font-semibold border border-[#262B34]'
                  : 'text-[#969EAA] hover:text-white'
              }`}
            >
              Все скины CS2
            </button>

            <button
              onClick={() => { sound.playClick(); setCatalogTab('inventory'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                catalogTab === 'inventory'
                  ? 'bg-[#191D24] text-white font-semibold border border-[#262B34]'
                  : 'text-[#969EAA] hover:text-white'
              }`}
            >
              <span>Дропы сессии</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#262B34] text-[10px] text-white">
                {demoInventory.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#969EAA]" />
              <input
                type="text"
                placeholder="Поиск по названию или оружию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12151A] border border-[#262B34] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#656D7B] outline-none focus:border-white/50"
              />
            </div>

            <button
              onClick={() => { sound.playClick(); setSortAsc(!sortAsc); }}
              title={sortAsc ? 'Сначала дешевле' : 'Сначала дороже'}
              className="p-2 rounded-xl bg-[#12151A] border border-[#262B34] text-[#969EAA] hover:text-white transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Все категории' },
            { id: 'knives', label: 'Ножи' },
            { id: 'gloves', label: 'Перчатки' },
            { id: 'rifles', label: 'Винтовки' },
            { id: 'pistols', label: 'Пистолеты' },
            { id: 'smgs', label: 'SMG' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#191D24] text-white font-medium border border-[#262B34]'
                  : 'text-[#969EAA] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 min-h-[260px]">
          {filteredCatalogItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-[#969EAA] text-xs">
              <Package className="w-10 h-10 opacity-30 mb-2" />
              <p>
                {catalogTab === 'inventory' 
                  ? 'В текущей сессии дропов нет. Откройте бесплатный кейс во вкладке Кейсы.'
                  : 'По вашему запросу скины не найдены.'}
              </p>
            </div>
          ) : (
            filteredCatalogItems.map((item) => {
              const isTarget = targetSkin?.id === item.id;
              const isInputSelected = selectedInputItems.some((i) => i.id === item.id);

              return (
                <motion.div
                  key={'instanceId' in item ? (item as UserInventoryItem).instanceId : item.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    if (catalogTab === 'inventory') {
                      handleToggleInputItem(item as UserInventoryItem);
                    } else {
                      sound.playClick();
                      setTargetSkin(item);
                    }
                  }}
                  className={`group relative bg-[#12151A] hover:bg-[#191D24] rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-colors border h-40 ${
                    isTarget
                      ? 'border-white ring-1 ring-white bg-[#191D24]'
                      : isInputSelected
                      ? 'border-[#27C98A] ring-1 ring-[#27C98A]'
                      : 'border-[#262B34] hover:border-[#3B4252]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#969EAA] font-mono-num">{item.wear || 'FN'}</span>
                    <span className="font-mono-num font-semibold text-white">{formatPrice(item.price)}</span>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-1 my-1">
                    <SkinImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      rarity={item.rarity}
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-[10px] text-[#969EAA] truncate">{item.weapon}</p>
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  </div>

                  {isTarget && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-bold">
                      Цель
                    </div>
                  )}
                  {isInputSelected && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#27C98A] text-black text-[9px] font-bold">
                      Выбран
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
