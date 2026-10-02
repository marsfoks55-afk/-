export type Rarity = 
  | 'consumer'
  | 'industrial'
  | 'milspec'
  | 'restricted'
  | 'classified'
  | 'covert'
  | 'extraordinary';

export type WeaponCategory = 'knives' | 'gloves' | 'rifles' | 'pistols' | 'smgs' | 'heavy';

export type CaseCategory = 'Budget' | 'Standard' | 'Premium' | 'Special' | 'High Tier';

export interface Skin {
  id: string;
  weapon: string;
  name: string;
  price: number; // Reference community market price in EUR
  rarity: Rarity;
  image: string;
  category: WeaponCategory;
  wear?: 'FN' | 'MW' | 'FT' | 'WW' | 'BS';
  float?: number;
  statTrak?: boolean;
}

export interface UserInventoryItem extends Skin {
  instanceId: string;
  acquiredAt: number;
  acquiredFrom: 'case' | 'upgrader' | 'starter';
}

export interface CaseDropItem {
  skin: Skin;
  chance: number; // Percentage, e.g. 52.5%
}

export interface CaseItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: CaseCategory;
  description: string;
  accentColor: string;
  badge?: string;
  drops: CaseDropItem[];
  skins: Skin[];
}

export type Currency = 'EUR' | 'USD' | 'UAH';

export type PageId = 
  | 'home'
  | 'cases'
  | 'upgrader'
  | 'market'
  | 'inventory'
  | 'profile'
  | 'history'
  | 'changelog'
  | 'terms'
  | 'faq'
  | 'privacy';

export interface SteamUser {
  steamId: string;
  displayName: string;
  avatarUrl: string;
  tradeUrl?: string;
  joinedAt: number;
  isVerified: boolean;
}

export interface Transaction {
  id: string;
  type: 'simulation_case' | 'simulation_upgrade';
  amount: number;
  currency: Currency;
  status: 'simulation';
  timestamp: number;
  description: string;
  skin?: Skin;
}

export interface UserStats {
  totalUpgrades: number;
  successfulUpgrades: number;
  totalCasesOpened: number;
  bestDrop?: Skin;
}
