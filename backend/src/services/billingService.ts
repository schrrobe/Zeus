import { randomUUID } from 'crypto';
import type { AdminDashboardSummary, RevenuePoint } from '../types';
import { userService } from './userService';

interface TransactionRecord {
  id: string;
  userId: string;
  amountEUR: number;
  billingCycle: 'monthly' | 'annual';
  createdAt: Date;
}

const transactions: TransactionRecord[] = [];

const PREMIUM_MONTHLY = 5;
const PREMIUM_ANNUAL = 36;

export const billingService = {
  async recordSubscription(userId: string, billingCycle: 'monthly' | 'annual') {
    const amount = billingCycle === 'monthly' ? PREMIUM_MONTHLY : PREMIUM_ANNUAL;
    transactions.push({
      id: randomUUID(),
      userId,
      amountEUR: amount,
      billingCycle,
      createdAt: new Date()
    });
  },

  async summary(): Promise<AdminDashboardSummary> {
    const users = await userService.all();
    const premiumUsers = users.filter((user) => user.tier === 'premium').length;
    const monthlyRecurringRevenueEUR = premiumUsers * PREMIUM_MONTHLY;
    const annualRunRateEUR = monthlyRecurringRevenueEUR * 12;

    const revenueHistory: RevenuePoint[] = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      const label = date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
      const monthlyTransactions = transactions.filter((tx) => tx.createdAt.getMonth() === date.getMonth());
      const revenue = monthlyTransactions.reduce((sum, tx) => sum + tx.amountEUR, 0);
      return {
        month: label,
        revenueEUR: revenue
      };
    }).reverse();

    return {
      totalUsers: users.length,
      premiumUsers,
      monthlyRecurringRevenueEUR,
      annualRunRateEUR,
      revenueHistory
    };
  }
};
