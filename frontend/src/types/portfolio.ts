export interface ExchangeBalance {
  id: string;
  name: string;
  platform: 'wallet' | 'exchange';
  provider: 'ethereum' | 'solana' | 'bitcoin' | 'bitvavo' | 'bitpanda' | 'coinbase';
  balance: number;
  fiatValue: number;
  currency: string;
  addressOrAccount: string;
  lastSyncedAt: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface PortfolioSnapshot {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  totalProfitPercentage: number;
  balances: ExchangeBalance[];
  performance: PerformancePoint[];
}

export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: SubscriptionTier;
  connectedExchanges: string[];
  createdAt: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  visible: boolean;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  premiumUsers: number;
  monthlyRecurringRevenue: number;
  transactions: Array<{
    id: string;
    userId: string;
    userEmail: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed';
    createdAt: string;
  }>;
  revenueHistory: PerformancePoint[];
}
