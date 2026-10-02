import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, ArrowUpDown, Filter, Package, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Skin } from '../types';
import { SKINS_DATABASE } from '../data/skins';
import { SkinImage } from '../components/ui/SkinImage';
import { sound } from '../utils/sound';

export const MarketView: React.FC = () => {
  const { formatPrice, requestRealOperationDisabled, setActivePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredSkins = useMemo(() => {
    return SKINS_DATABASE.filter((skin) => {
      if (selectedCategory !== 'all' && skin.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = skin.name.toLowerCase().includes(q) || skin.weapon.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (minPrice && skin.price < parseFloat(minPrice)) return false;
      if (maxPrice && skin.price > parseFloat(maxPrice)) return false;
      return true;
    }).sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortAsc]);

  const handleInspectInUpgrader = (skin: Skin) => {
    sound.playClick();
    setActivePage('upgrader');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B34]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">КАТАЛОГ ПРЕДМЕТОВ CS2</h1>
            <span className="text-[10px] font-mono-num font-semibold text-[#E5B84D] bg-[#12151A] px-2.5 py-0.5 rounded-full border border-[#262B34]">
              PREVIEW MODE • ALPHA 0.1.1
            </span>
          </div>
          <p className="text-xs text-[#969EAA] mt-0.5 flex items-center gap-2">
            <span>Справочные рыночные котировки предметов Counter-Strike 2</span>
            <span className="text-[#656D7B] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Синхронизация: Октябрь 2026
            </span>
          </p>
        </div>

        {/* Alpha Notice */}
        <div className="bg-[#12151A] border border-[#262B34] px-3.5 py-2 rounded-xl text-xs text-[#969EAA] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#E5B84D] shrink-0" />
          <span>Торговля за реальные средства временно отключена в Alpha</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#969EAA]" />
            <input
              type="text"
              placeholder="Поиск по оружию или скину (напр. Karambit, AWP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151A] border border-[#262B34] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#656D7B] outline-none focus:border-white/50"
            />
          </div>

          {/* Price Range & Sort */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-[#12151A] border border-[#262B34] rounded-xl px-2.5 py-1.5">
              <span className="text-[#969EAA]">от</span>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-12 bg-transparent text-white outline-none font-mono-num"
              />
              <span className="text-[#969EAA]">до</span>
              <input
                type="number"
                placeholder="9999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-14 bg-transparent text-white outline-none font-mono-num"
              />
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setSortAsc(!sortAsc);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12151A] border border-[#262B34] text-xs text-[#969EAA] hover:text-white transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortAsc ? 'Дешевле' : 'Дороже'}</span>
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
            { id: 'heavy', label: 'Тяжелое' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#191D24] text-white font-medium border border-[#262B34]'
                  : 'text-[#969EAA] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredSkins.length === 0 ? (
        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-16 text-center flex flex-col items-center justify-center text-[#969EAA]">
          <Package className="w-12 h-12 stroke-1 opacity-30 mb-3" />
          <h3 className="text-base font-bold text-white">Предложений не найдено</h3>
          <p className="text-xs max-w-sm mt-1 mb-4">
            По заданным фильтрам и поисковому запросу скинов нет в наличии.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMinPrice('');
              setMaxPrice('');
            }}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredSkins.map((skin) => {
            return (
              <motion.div
                key={skin.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="group bg-[#0D0F13] hover:bg-[#12151A] border border-[#262B34] hover:border-[#3B4252] rounded-2xl p-3.5 flex flex-col justify-between transition-colors h-64 shadow-md"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#969EAA] font-mono-num uppercase">{skin.wear || 'FN'}</span>
                  <span className="text-[10px] uppercase font-semibold text-[#969EAA] bg-[#12151A] px-2 py-0.5 rounded border border-[#262B34]">
                    {skin.rarity}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center p-2 my-2">
                  <SkinImage
                    src={skin.image}
                    alt={skin.name}
                    category={skin.category}
                    rarity={skin.rarity}
                  />
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-[10px] text-[#969EAA] truncate">{skin.weapon}</p>
                  <h4 className="text-xs font-bold text-white truncate">{skin.name}</h4>
                  <p className="text-xs font-mono-num text-[#969EAA]">
                    Рынок: <strong className="text-white">{formatPrice(skin.price)}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleInspectInUpgrader(skin)}
                    className="py-1.5 rounded-lg text-[10px] font-semibold bg-[#191D24] hover:bg-white hover:text-black text-white border border-[#262B34] transition-colors"
                  >
                    В апгрейдер
                  </button>

                  <button
                    onClick={() => requestRealOperationDisabled('Покупка')}
                    className="py-1.5 rounded-lg text-[10px] font-semibold bg-[#12151A] hover:bg-[#191D24] text-[#969EAA] hover:text-white border border-[#262B34] transition-colors"
                  >
                    Купить
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
