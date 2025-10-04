export type SubscriptionTier = 'free' | 'premium';

export interface ZeusUser {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  tier: SubscriptionTier;
  refreshIntervalSeconds: number;
  exchangesConnected: number;
}

export interface AdminNotice {
  id: string;
  title: string;
  message: string;
  type: 'banner' | 'modal';
  isActive: boolean;
}

export interface AssetPosition {
  assetSymbol: string;
  assetName: string;
  quantity: number;
  currentPriceEUR: number;
  valueEUR: number;
  change24hPercent: number;
  location: 'wallet' | 'exchange';
  provider: string;
}

export interface ExchangeBreakdown {
  exchangeName: string;
  valueEUR: number;
  percentage: number;
  assets: AssetPosition[];
}

export interface WalletBreakdown {
  network: 'ethereum' | 'solana' | 'bitcoin';
  address: string;
  valueEUR: number;
  percentage: number;
  assets: AssetPosition[];
}

export interface PortfolioSnapshot {
  id: string;
  timestamp: string;
  totalValueEUR: number;
  change24hPercent: number;
  change30dPercent: number;
  change1yPercent: number;
  exchanges: ExchangeBreakdown[];
  wallets: WalletBreakdown[];
}

export interface ExchangeConnectionPayload {
  exchange: 'bitvavo' | 'coinbase' | 'binance' | 'bitpanda';
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
}

export interface WalletConnectionPayload {
  network: WalletBreakdown['network'];
  address: string;
}

export interface RevenuePoint {
  month: string;
  revenueEUR: number;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  premiumUsers: number;
  monthlyRecurringRevenueEUR: number;
  annualRunRateEUR: number;
  revenueHistory: RevenuePoint[];
}
