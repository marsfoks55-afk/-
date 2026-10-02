import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Package, Sparkles, Search, ArrowUpDown, ArrowRight, LogIn, Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserInventoryItem } from '../types';
import { SkinImage } from '../components/ui/SkinImage';
import { RARITY_COLORS } from '../components/cases/CaseOpeningRoulette';
import { audioManager } from '../audio/AudioManager';

export const InventoryView: React.FC = () => {
  const { 
    demoInventory, 
    clearDemoInventory,
    formatPrice, 
    removeDemoInventoryItems, 
    setActivePage, 
    setIsAuthModalOpen,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserInventoryItem | null>(null);

  const totalValue = demoInventory.reduce((acc, item) => acc + item.price, 0);

  const filteredItems = useMemo(() => {
    return demoInventory.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.weapon.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
  }, [demoInventory, searchQuery, sortAsc]);

  const handleDiscard = (instanceId: string) => {
    audioManager.play('button_click');
    removeDemoInventoryItems([instanceId]);
    if (selectedItem?.instanceId === instanceId) {
      setSelectedItem(null);
    }
    addToast('info', 'Предмет удален', 'Демо-предмет удален из локального хранилища');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B34]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">ДЕМО-ИНВЕНТАРЬ СЕССИИ</h1>
            <span className="text-[10px] font-mono-num font-semibold text-[#27C98A] bg-[#12151A] px-2.5 py-0.5 rounded-full border border-[#262B34]">
              {demoInventory.length} СИМУЛЯЦИОННЫХ ПРЕДМЕТОВ
            </span>
          </div>
          <p className="text-xs text-[#969EAA] mt-0.5">
            Сохраняется в вашем браузере (LocalStorage) между перезагрузками страницы
          </p>
        </div>

        {/* Portfolio Valuation & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0D0F13] border border-[#262B34] px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-[#969EAA] uppercase font-medium">Рыночный эквивалент</span>
            <p className="text-base font-bold text-white font-mono-num">{formatPrice(totalValue)}</p>
          </div>

          {demoInventory.length > 0 && (
            <button
              onClick={clearDemoInventory}
              title="Очистить все предметы демо-инвентаря"
              className="px-3 py-2.5 rounded-xl bg-[#12151A] hover:bg-[#EF6262]/20 hover:text-[#EF6262] text-[#969EAA] border border-[#262B34] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Очистить</span>
            </button>
          )}

          <button
            onClick={() => {
              audioManager.play('button_click');
              setActivePage('upgrader');
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors flex items-center gap-2"
          >
            <span>В Апгрейдер</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Account Status Banner */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Steam Синхронизация</h3>
            <span className="text-[10px] font-mono-num text-[#E5B84D] bg-[#12151A] px-2 py-0.5 rounded border border-[#262B34]">
              COMING SOON
            </span>
          </div>
          <p className="text-xs text-[#969EAA]">
            Вход через официальный Steam OpenID находится в активной разработке. Сейчас активен локальный демонстрационный режим сессии.
          </p>
        </div>

        <button
          onClick={() => {
            audioManager.play('button_click');
            setIsAuthModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#12151A] hover:bg-[#191D24] text-white border border-[#262B34] font-semibold text-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Статус авторизации</span>
        </button>
      </div>

      {/* Search and Sort Filter */}
      {demoInventory.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-[#0D0F13] border border-[#262B34] rounded-2xl p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#969EAA]" />
            <input
              type="text"
              placeholder="Поиск по инвентарю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151A] border border-[#262B34] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#656D7B] outline-none"
            />
          </div>

          <button
            onClick={() => {
              audioManager.play('button_click');
              setSortAsc(!sortAsc);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12151A] border border-[#262B34] text-xs text-[#969EAA] hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Сначала дешевле' : 'Сначала дороже'}</span>
          </button>
        </div>
      )}

      {/* Grid & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {filteredItems.length === 0 ? (
            <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-16 text-center flex flex-col items-center justify-center text-[#969EAA]">
              <Package className="w-12 h-12 stroke-1 opacity-30 mb-3" />
              <h3 className="text-base font-bold text-white">Инвентарь текущей сессии пуст</h3>
              <p className="text-xs max-w-sm mt-1 mb-6">
                Вы ещё не открывали кейсы в симуляторе. Откройте любой из 50 кастомных кейсов для получения скинов.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    audioManager.play('button_click');
                    setActivePage('cases');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors"
                >
                  Выбрать кейс (50)
                </button>
                <button
                  onClick={() => {
                    audioManager.play('button_click');
                    setActivePage('upgrader');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#12151A] hover:bg-[#191D24] text-white border border-[#262B34] font-semibold text-xs transition-colors"
                >
                  В Апгрейдер
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.instanceId === item.instanceId;
                const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.milspec;

                return (
                  <motion.div
                    key={item.instanceId}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      audioManager.play('button_hover');
                      setSelectedItem(item);
                    }}
                    className={`bg-[#0D0F13] hover:bg-[#12151A] border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-colors h-52 shadow-md ${
                      isSelected
                        ? 'border-white ring-1 ring-white bg-[#12151A]'
                        : 'border-[#262B34] hover:border-[#3B4252]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#969EAA] font-mono-num">{item.wear || 'FN'}</span>
                      <span className="font-mono-num font-semibold text-white">{formatPrice(item.price)}</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-2 my-1">
                      <SkinImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        rarity={item.rarity}
                      />
                    </div>

                    <div className="leading-tight space-y-0.5">
                      <p className="text-[10px] text-[#969EAA] truncate">{item.weapon}</p>
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    </div>

                    <div 
                      className="w-full h-1 rounded-full mt-1.5"
                      style={{ backgroundColor: rarityStyle.border }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Item Detail Panel */}
        {selectedItem && (
          <div className="lg:col-span-4 bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Спецификация предмета
              </span>
              <button
                onClick={() => {
                  audioManager.play('button_click');
                  setSelectedItem(null);
                }}
                className="text-[#969EAA] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="h-44 flex items-center justify-center">
              <SkinImage
                src={selectedItem.image}
                alt={selectedItem.name}
                category={selectedItem.category}
                rarity={selectedItem.rarity}
              />
            </div>

            <div className="space-y-1 text-center">
              <p className="text-xs text-[#969EAA]">{selectedItem.weapon}</p>
              <h3 className="text-lg font-bold text-white">{selectedItem.name}</h3>
              <p className="text-base font-mono-num font-bold text-white pt-1">
                {formatPrice(selectedItem.price)}
              </p>
            </div>

            {/* Float & Metadata */}
            <div className="bg-[#12151A] border border-[#262B34] rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#969EAA]">Износ:</span>
                <span className="text-white font-mono-num">{selectedItem.wear || 'FN'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969EAA]">Float Value:</span>
                <span className="text-white font-mono-num">{selectedItem.float?.toFixed(4) || '0.0184'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969EAA]">Источник:</span>
                <span className="text-white uppercase font-mono-num text-[10px]">
                  {selectedItem.acquiredFrom} (Simulation)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#969EAA]">Simulation ID:</span>
                <span className="text-zinc-500 font-mono-num text-[10px] truncate max-w-[120px]">
                  {selectedItem.instanceId}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  audioManager.play('button_click');
                  setActivePage('upgrader');
                }}
                className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Использовать в Апгрейдере</span>
              </button>

              <button
                onClick={() => handleDiscard(selectedItem.instanceId)}
                className="w-full py-2.5 rounded-xl bg-[#12151A] hover:bg-[#EF6262]/15 hover:text-[#EF6262] border border-[#262B34] text-xs text-white transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#969EAA]" />
                <span>Удалить из сессии</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
