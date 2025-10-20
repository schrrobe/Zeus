export type SubscriptionTier = 'free' | 'premium';
export type UserRole = 'user' | 'admin';

export interface ZeusUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
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

export interface PortfolioAsset {
  assetSymbol: string;
  assetName: string;
  quantity: number;
  currentPriceEUR: number;
  valueEUR: number;
  change24hPercent: number;
  location: 'wallet' | 'exchange';
  provider: string;
}

export interface PortfolioSnapshot {
  id: string;
  timestamp: string;
  totalValueEUR: number;
  change24hPercent: number;
  change30dPercent: number;
  change1yPercent: number;
  exchanges: Array<{
    exchangeName: string;
    valueEUR: number;
    percentage: number;
    assets: PortfolioAsset[];
  }>;
  wallets: Array<{
    network: 'ethereum' | 'solana' | 'bitcoin';
    address: string;
    valueEUR: number;
    percentage: number;
    assets: PortfolioAsset[];
  }>;
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
