import { randomUUID } from 'node:crypto';
import type { AdminDashboardSummary, AdminBanner, PortfolioSnapshot, UserProfile } from '../types/api';

const balances = [
  {
    id: randomUUID(),
    name: 'Ethereum Wallet',
    platform: 'wallet',
    provider: 'ethereum',
    balance: 2.5,
    fiatValue: 5200,
    currency: 'ETH',
    addressOrAccount: '0x1234...abcd',
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Solana Wallet',
    platform: 'wallet',
    provider: 'solana',
    balance: 250,
    fiatValue: 4800,
    currency: 'SOL',
    addressOrAccount: 'So1anaAddre55',
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Bitvavo',
    platform: 'exchange',
    provider: 'bitvavo',
    balance: 1.2,
    fiatValue: 35000,
    currency: 'BTC',
    addressOrAccount: 'user@bitvavo',
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Coinbase',
    platform: 'exchange',
    provider: 'coinbase',
    balance: 3,
    fiatValue: 12000,
    currency: 'ETH',
    addressOrAccount: 'user@coinbase',
    lastSyncedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    name: 'Bitpanda',
    platform: 'exchange',
    provider: 'bitpanda',
    balance: 1500,
    fiatValue: 2000,
    currency: 'EUR',
    addressOrAccount: 'user@bitpanda',
    lastSyncedAt: new Date().toISOString()
  }
] as const;

export function mockPortfolioSnapshot(): PortfolioSnapshot {
  const totalValue = balances.reduce((sum, balance) => sum + balance.fiatValue, 0);
  const totalInvested = totalValue * 0.7;
  const totalProfit = totalValue - totalInvested;
  const totalProfitPercentage = (totalProfit / totalInvested) * 100;
  const performance = Array.from({ length: 12 }).map((_, index) => ({
    date: new Date(new Date().setMonth(new Date().getMonth() - (11 - index))).toISOString().slice(0, 10),
    value: totalValue * (0.6 + index * 0.04)
  }));
  return {
    totalValue,
    totalInvested,
    totalProfit,
    totalProfitPercentage,
    balances: [...balances],
    performance
  };
}

export function mockUserProfile(): UserProfile {
  return {
    id: 'user-1',
    name: 'Satoshi Nakamoto',
    email: 'satoshi@zeus.app',
    tier: 'premium',
    connectedExchanges: ['bitvavo', 'coinbase', 'bitpanda'],
    createdAt: new Date().toISOString()
  };
}

export function mockAdminSummary(): AdminDashboardSummary {
  const portfolio = mockPortfolioSnapshot();
  const transactions = Array.from({ length: 6 }).map((_, index) => ({
    id: randomUUID(),
    userId: `user-${index + 1}`,
    userEmail: `kunde${index + 1}@zeus.app`,
    amount: index % 2 === 0 ? 500 : 3600,
    currency: 'EUR',
    status: index % 3 === 0 ? 'pending' : 'succeeded',
    createdAt: new Date(Date.now() - index * 86400000).toISOString()
  }));
  return {
    totalUsers: 240,
    premiumUsers: 94,
    monthlyRecurringRevenue: 4700,
    transactions,
    revenueHistory: portfolio.performance
  };
}

export function mockBanners(): AdminBanner[] {
  return [
    {
      id: randomUUID(),
      title: 'Maintenance',
      message: 'Geplante Wartung am Sonntag 12:00 UTC',
      type: 'info',
      visible: true
    }
  ];
}

export function mockBanner(banner: Omit<AdminBanner, 'id'>): AdminBanner {
  return {
    id: randomUUID(),
    ...banner
  };
}

export function toggleUserTier(userId: string, tier: 'free' | 'premium') {
  return { userId, tier };
}

export function deleteUser(userId: string) {
  return { userId, deleted: true };
}
