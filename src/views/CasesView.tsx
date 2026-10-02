import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CaseItem, Skin, CaseCategory } from '../types';
import { CS2_CASES } from '../data/cases';
import { SkinImage } from '../components/ui/SkinImage';
import { CaseOpeningRoulette, RARITY_COLORS } from '../components/cases/CaseOpeningRoulette';
import { audioManager } from '../audio/AudioManager';

export const CasesView: React.FC = () => {
  const { formatPrice, openCaseSimulation, addToast, selectedCaseId, setSelectedCaseId } = useApp();
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortMode, setSortMode] = useState<'price_asc' | 'price_desc' | 'name'>('price_asc');

  // Handle selectedCaseId from context if navigated from Home
  useEffect(() => {
    if (selectedCaseId) {
      const found = CS2_CASES.find((c) => c.id === selectedCaseId);
      if (found) {
        setSelectedCase(found);
      }
    }
  }, [selectedCaseId]);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Все кейсы (50)' },
    { id: 'Budget', label: 'Budget (12)' },
    { id: 'Standard', label: 'Standard (12)' },
    { id: 'Premium', label: 'Premium (10)' },
    { id: 'Special', label: 'Special (10)' },
    { id: 'High Tier', label: 'High Tier (6)' },
  ];

  const filteredCases = useMemo(() => {
    return CS2_CASES.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
        const matchesSkin = c.drops.some((d) => d.skin.name.toLowerCase().includes(q) || d.skin.weapon.toLowerCase().includes(q));
        if (!matchesName && !matchesSkin) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortMode === 'price_asc') return a.price - b.price;
      if (sortMode === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, sortMode]);

  const handleSelectCase = (c: CaseItem) => {
    audioManager.play('button_click');
    setSelectedCase(c);
    setSelectedCaseId(c.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    audioManager.play('tab_switch');
    setSelectedCase(null);
    setSelectedCaseId(null);
  };

  const handleDropClaim = (skin: Skin) => {
    if (selectedCase) {
      openCaseSimulation(skin, selectedCase.name);
      addToast('success', 'Дроп сохранен', `${skin.weapon} | ${skin.name} добавлен в демо-инвентарь`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B34]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">КОЛЛЕКЦИЯ КЕЙСОВ CS2</h1>
            <span className="text-[10px] font-mono-num font-semibold text-[#E5B84D] bg-[#12151A] px-2.5 py-0.5 rounded-full border border-[#262B34]">
              50 CUSTOM CASES • ALPHA 0.2.0
            </span>
          </div>
          <p className="text-xs text-[#969EAA] mt-0.5">
            Реалистичный симулятор открытия с синхронизированной CS2-рулеткой и чистыми вероятностями
          </p>
        </div>

        {selectedCase && (
          <button
            onClick={handleBackToCatalog}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12151A] hover:bg-[#191D24] border border-[#262B34] text-xs text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в каталог</span>
          </button>
        )}
      </div>

      {selectedCase ? (
        /* Detailed Case Screen with CS2 CaseOpeningRoulette */
        <div className="space-y-10 animate-fade-in">
          
          {/* Case Info Banner */}
          <div className="bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div 
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ backgroundColor: selectedCase.accentColor }}
            />

            <div className="flex items-center gap-6">
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#12151A] border p-2 flex items-center justify-center shrink-0 shadow-lg"
                style={{ borderColor: `${selectedCase.accentColor}40` }}
              >
                <SkinImage
                  src={selectedCase.image}
                  alt={selectedCase.name}
                  isCase={true}
                  className="max-h-full"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono-num"
                    style={{ backgroundColor: `${selectedCase.accentColor}20`, color: selectedCase.accentColor }}
                  >
                    {selectedCase.category}
                  </span>
                  <span className="text-[10px] text-[#656D7B] font-mono-num">
                    {selectedCase.drops.length} предметов в тираже
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedCase.name}
                </h2>
                <p className="text-xs text-[#969EAA] max-w-lg leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#969EAA] uppercase font-medium">Рыночный эквивалент</span>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono-num">
                {formatPrice(selectedCase.price)}
              </p>
              <span className="text-[10px] font-mono-num text-[#27C98A] bg-[#27C98A]/10 px-2 py-0.5 rounded border border-[#27C98A]/20 mt-1 inline-block">
                БЕСПЛАТНЫЙ ДЕМО-СИМУЛЯТОР
              </span>
            </div>
          </div>

          {/* The Core CaseOpeningRoulette Component */}
          <div className="bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <CaseOpeningRoulette
              caseItem={selectedCase}
              onDropClaim={handleDropClaim}
              onOpenAnother={() => {}}
            />
          </div>

          {/* Explicit Drop Chances & Skin Table */}
          <div className="bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Содержимое тиража и вероятности дропа
                </h3>
                <p className="text-xs text-[#969EAA] mt-0.5">
                  Честная таблица распределения вероятностей выпадения каждого предмета
                </p>
              </div>

              <span className="text-xs font-mono-num text-[#656D7B]">
                Сумма вероятностей: 100.00%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {selectedCase.drops.map((drop, idx) => {
                const skin = drop.skin;
                const rarityStyle = RARITY_COLORS[skin.rarity] || RARITY_COLORS.milspec;

                return (
                  <div
                    key={`${skin.id}-${idx}`}
                    className="bg-[#12151A] hover:bg-[#191D24] border border-[#262B34] hover:border-[#3B4252] rounded-2xl p-3 flex flex-col justify-between h-48 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono-num font-semibold" style={{ color: rarityStyle.border }}>
                        {drop.chance.toFixed(2)}%
                      </span>
                      <span className="font-mono-num text-white">
                        {formatPrice(skin.price)}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-1 my-1">
                      <SkinImage
                        src={skin.image}
                        alt={skin.name}
                        category={skin.category}
                        rarity={skin.rarity}
                      />
                    </div>

                    <div className="leading-tight space-y-0.5">
                      <p className="text-[10px] text-[#969EAA] truncate">{skin.weapon}</p>
                      <h4 className="text-xs font-semibold text-white truncate">{skin.name}</h4>
                    </div>

                    <div 
                      className="w-full h-1 rounded-full mt-2"
                      style={{ backgroundColor: rarityStyle.border }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 50 Cases Catalog Grid */
        <div className="space-y-6">
          
          {/* Controls: Search, Categories, Sort */}
          <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#969EAA]" />
                <input
                  type="text"
                  placeholder="Поиск по названию кейса или оружия..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12151A] border border-[#262B34] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#656D7B] outline-none focus:border-white/50"
                />
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#969EAA] hidden sm:inline">Сортировка:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as any)}
                  className="bg-[#12151A] border border-[#262B34] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="price_asc">Сначала доступные</option>
                  <option value="price_desc">Сначала дорогие</option>
                  <option value="name">По алфавиту (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioManager.play('tab_switch');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-[#12151A] text-[#969EAA] hover:text-white border border-[#262B34]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 50 Cases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCases.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleSelectCase(c)}
                className="group bg-[#0D0F13] hover:bg-[#12151A] border border-[#262B34] hover:border-[#3B4252] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-colors shadow-lg relative overflow-hidden"
              >
                {/* Subtle Top Accent Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: c.accentColor }}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono-num"
                      style={{ backgroundColor: `${c.accentColor}15`, color: c.accentColor }}
                    >
                      {c.category}
                    </span>
                    <span className="text-xs font-mono-num font-semibold text-white bg-[#12151A] px-2.5 py-1 rounded-lg border border-[#262B34]">
                      {formatPrice(c.price)}
                    </span>
                  </div>

                  <div className="h-36 flex items-center justify-center my-3">
                    <SkinImage
                      src={c.image}
                      alt={c.name}
                      isCase={true}
                      className="max-h-full group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262B34] flex items-center justify-between text-xs text-[#969EAA]">
                  <span>{c.drops.length} скинов</span>
                  <span className="group-hover:text-white font-medium flex items-center gap-1 transition-colors text-white">
                    Открыть рулетку →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
