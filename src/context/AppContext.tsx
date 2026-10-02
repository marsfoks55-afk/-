import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Skin, 
  UserInventoryItem, 
  Currency, 
  PageId, 
  Transaction, 
  UserStats,
  SteamUser,
  CaseItem
} from '../types';
import { ToastMessage, ToastType } from '../components/ui/Toast';
import { audioManager } from '../audio/AudioManager';

interface AppContextType {
  // Authentication - honest Alpha state
  user: SteamUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;

  // Wallet - honest €0.00 in Alpha
  walletBalance: number;
  isWalletAvailable: boolean;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInEur: number) => string;

  // Local Session Simulation Inventory with LocalStorage
  demoInventory: UserInventoryItem[];
  clearDemoInventory: () => void;
  transactions: Transaction[];
  stats: UserStats;

  // Navigation & Modals
  activePage: PageId;
  setActivePage: (p: PageId) => void;
  language: 'ru' | 'en';
  setLanguage: (l: 'ru' | 'en') => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (v: boolean) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (v: boolean) => void;
  isAudioSettingsOpen: boolean;
  setIsAudioSettingsOpen: (v: boolean) => void;

  // Selected case state for quick navigation
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  dismissToast: (id: string) => void;

  // Actions
  addDemoInventoryItem: (skin: Skin, source: 'case' | 'upgrader') => UserInventoryItem;
  removeDemoInventoryItems: (instanceIds: string[]) => void;
  openCaseSimulation: (wonSkin: Skin, caseName: string) => void;
  executeUpgradeSimulation: (inputItems: UserInventoryItem[], targetSkin: Skin, chance: number) => Promise<boolean>;
  requestRealOperationDisabled: (opName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  EUR: { rate: 1.0, symbol: '€', prefix: false },
  USD: { rate: 1.08, symbol: '$', prefix: true },
  UAH: { rate: 44.5, symbol: '₴', prefix: false },
};

const INVENTORY_STORAGE_KEY = 'caser_demo_inventory_v2';
const STATS_STORAGE_KEY = 'caser_stats_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // P0: User is strictly null (unauthenticated).
  const [user] = useState<SteamUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // P0: Real wallet balance strictly €0.00.
  const [walletBalance] = useState<number>(0.00);
  const isWalletAvailable = false;

  const [currency, setCurrency] = useState<Currency>('EUR');

  // Load demo inventory from localStorage
  const [demoInventory, setDemoInventory] = useState<UserInventoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Save demo inventory on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(demoInventory));
      } catch {}
    }
  }, [demoInventory]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activePage, setActivePage] = useState<PageId>('home');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState<boolean>(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Stats calculation
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STATS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {
      totalUpgrades: 0,
      successfulUpgrades: 0,
      totalCasesOpened: 0,
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
      } catch {}
    }
  }, [stats]);

  // Price Formatter with Tabular formatting
  const formatPrice = (amountInEur: number): string => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.EUR;
    const converted = amountInEur * config.rate;
    const formattedNum = converted.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return config.prefix ? `${config.symbol}${formattedNum}` : `${formattedNum} ${config.symbol}`;
  };

  const clearDemoInventory = () => {
    audioManager.play('button_click');
    setDemoInventory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(INVENTORY_STORAGE_KEY);
    }
    addToast('info', 'Инвентарь очищен', 'Все демонстрационные предметы текущей сессии удалены');
  };

  const requestRealOperationDisabled = (opName: string) => {
    audioManager.play('upgrade_fail');
    addToast(
      'info',
      `${opName} — Недоступно в Alpha`,
      'Реальные финансовые транзакции отключены до релиза серверного бэкенда и проверки Steam OpenID.'
    );
  };

  // Add Item to session simulation inventory
  const addDemoInventoryItem = (skin: Skin, source: 'case' | 'upgrader'): UserInventoryItem => {
    const newItem: UserInventoryItem = {
      ...skin,
      instanceId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      acquiredAt: Date.now(),
      acquiredFrom: source,
    };
    setDemoInventory((prev) => [newItem, ...prev]);
    return newItem;
  };

  // Remove multiple specific items by unique instanceId in simulation
  const removeDemoInventoryItems = (instanceIds: string[]) => {
    const set = new Set(instanceIds);
    setDemoInventory((prev) => prev.filter((item) => !set.has(item.instanceId)));
  };

  // Visual Case opening simulation
  const openCaseSimulation = (wonSkin: Skin, caseName: string) => {
    addDemoInventoryItem(wonSkin, 'case');

    setStats((prev) => ({
      ...prev,
      totalCasesOpened: prev.totalCasesOpened + 1,
      bestDrop: !prev.bestDrop || wonSkin.price > prev.bestDrop.price ? wonSkin : prev.bestDrop,
    }));

    const tx: Transaction = {
      id: `sim-tx-${Date.now()}`,
      type: 'simulation_case',
      amount: 0,
      currency,
      status: 'simulation',
      timestamp: Date.now(),
      description: `[SIMULATION] Кейс ${caseName} → Дроп: ${wonSkin.weapon} | ${wonSkin.name}`,
      skin: wonSkin,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Visual Upgrade simulation
  const executeUpgradeSimulation = async (
    inputItems: UserInventoryItem[],
    targetSkin: Skin,
    chance: number
  ): Promise<boolean> => {
    if (inputItems.length > 0) {
      removeDemoInventoryItems(inputItems.map((i) => i.instanceId));
    }

    const roll = Math.random() * 100;
    const isWin = roll <= chance;

    setStats((prev) => ({
      ...prev,
      totalUpgrades: prev.totalUpgrades + 1,
      successfulUpgrades: isWin ? prev.successfulUpgrades + 1 : prev.successfulUpgrades,
      bestDrop: isWin && (!prev.bestDrop || targetSkin.price > prev.bestDrop.price) ? targetSkin : prev.bestDrop,
    }));

    const tx: Transaction = {
      id: `sim-tx-${Date.now()}`,
      type: 'simulation_upgrade',
      amount: 0,
      currency,
      status: 'simulation',
      timestamp: Date.now(),
      description: isWin
        ? `[SIMULATION] Апгрейд УСПЕХ (${chance.toFixed(2)}%) → ${targetSkin.weapon} | ${targetSkin.name}`
        : `[SIMULATION] Апгрейд НЕУДАЧА (${chance.toFixed(2)}%)`,
      skin: targetSkin,
    };
    setTransactions((prev) => [tx, ...prev]);

    return isWin;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        walletBalance,
        isWalletAvailable,
        currency,
        setCurrency,
        formatPrice,
        demoInventory,
        clearDemoInventory,
        transactions,
        stats,
        activePage,
        setActivePage,
        language,
        setLanguage,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        isAudioSettingsOpen,
        setIsAudioSettingsOpen,
        selectedCaseId,
        setSelectedCaseId,
        toasts,
        addToast,
        dismissToast,
        addDemoInventoryItem,
        removeDemoInventoryItems,
        openCaseSimulation,
        executeUpgradeSimulation,
        requestRealOperationDisabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
