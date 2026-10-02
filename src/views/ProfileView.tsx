import React from 'react';
import { User, ShieldAlert, History, Trophy, TrendingUp, Sparkles, Box, ArrowUpRight, ArrowDownLeft, LogIn, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/sound';

export const ProfileView: React.FC = () => {
  const { 
    stats, 
    walletBalance, 
    demoInventory, 
    formatPrice, 
    transactions,
    setIsAuthModalOpen,
  } = useApp();

  const winRate = stats.totalUpgrades > 0
    ? ((stats.successfulUpgrades / stats.totalUpgrades) * 100).toFixed(1)
    : '0.0';

  const totalInventoryValue = demoInventory.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* Profile Header Card */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white text-2xl font-bold">
            <User className="w-7 h-7 text-[#969EAA]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Гостевой профиль (Sandbox)</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-num font-bold bg-[#12151A] text-[#E5B84D] border border-[#262B34]">
                UNCONNECTED • ALPHA 0.1.1
              </span>
            </div>
            <p className="text-xs text-[#969EAA]">
              Сессия браузера изолирована. Вход через Steam OpenID 2.0 находится в разработке.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#12151A] border border-[#262B34] px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] text-[#969EAA] uppercase">Кошелёк</span>
            <p className="text-base font-bold text-white font-mono-num">{formatPrice(walletBalance)}</p>
          </div>

          <div className="bg-[#12151A] border border-[#262B34] px-4 py-2.5 rounded-xl text-right">
            <span className="text-[10px] text-[#969EAA] uppercase">Демо-предметы ({demoInventory.length})</span>
            <p className="text-base font-bold text-white font-mono-num">{formatPrice(totalInventoryValue)}</p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsAuthModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#E5E5E5] transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Статус Steam</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 space-y-1">
          <span className="text-xs text-[#969EAA] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Всего демо-апгрейдов
          </span>
          <p className="text-2xl font-extrabold text-white font-mono-num">{stats.totalUpgrades}</p>
          <span className="text-[10px] text-[#969EAA]">
            Успешных: <strong className="text-white font-mono-num">{stats.successfulUpgrades}</strong>
          </span>
        </div>

        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 space-y-1">
          <span className="text-xs text-[#969EAA] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Винрейт симулятора
          </span>
          <p className="text-2xl font-extrabold text-white font-mono-num">{winRate}%</p>
          <span className="text-[10px] text-[#969EAA]">Показатель текущей сессии</span>
        </div>

        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 space-y-1">
          <span className="text-xs text-[#969EAA] flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            Демо-открытий кейсов
          </span>
          <p className="text-2xl font-extrabold text-white font-mono-num">{stats.totalCasesOpened}</p>
          <span className="text-[10px] text-[#969EAA]">Тестовых рулеток</span>
        </div>

        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-5 space-y-1">
          <span className="text-xs text-[#969EAA] flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Лучший демо-дроп
          </span>
          <p className="text-base font-bold text-white truncate font-mono-num mt-1">
            {stats.bestDrop ? `${stats.bestDrop.name}` : '—'}
          </p>
          <span className="text-[10px] text-[#969EAA]">
            {stats.bestDrop ? formatPrice(stats.bestDrop.price) : 'Пока нет дропов'}
          </span>
        </div>
      </div>

      {/* Audit Trail / History */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262B34]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#969EAA]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Журнал событий симулятора (Audit)
            </h3>
          </div>
          <span className="text-[10px] font-mono-num text-[#969EAA]">
            События сессии ({transactions.length})
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-[#969EAA]">
            <p className="text-xs">Журнал операций сессии пуст</p>
            <p className="text-[11px] text-[#656D7B]">
              События будут зафиксированы после запуска теста в Апгрейдере или открытия тестового кейса.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#12151A] border border-[#262B34] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#191D24] text-[#E5B84D] flex items-center justify-center font-mono-num text-[10px] font-bold">
                      SIM
                    </div>

                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-[10px] text-[#656D7B]">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • Статус: {tx.status}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono-num font-semibold text-[#969EAA]">
                    DEMO
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
