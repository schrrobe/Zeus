import { randomUUID } from 'crypto';
import type { PortfolioSnapshot } from '../types';
import { pricingService } from './pricingService';

const snapshotsByUser = new Map<string, PortfolioSnapshot[]>();

export const portfolioService = {
  async list(userId: string) {
    if (!snapshotsByUser.has(userId)) {
      const seedSnapshot = await this.generateSnapshot(userId);
      snapshotsByUser.set(userId, [seedSnapshot]);
    }
    return snapshotsByUser.get(userId)!;
  },

  async refresh(userId: string, snapshotId: string) {
    const snapshots = await this.list(userId);
    const index = snapshots.findIndex((snapshot) => snapshot.id === snapshotId);
    if (index === -1) return;
    const refreshed = await this.generateSnapshot(userId);
    snapshots[index] = refreshed;
    snapshotsByUser.set(userId, [...snapshots]);
  },

  async generateSnapshot(userId: string): Promise<PortfolioSnapshot> {
    const prices = await pricingService.fetchPrices();
    const timestamp = new Date().toISOString();
    const wallets = pricingService.generateWalletBreakdown(prices);
    const exchanges = pricingService.generateExchangeBreakdown(prices);
    const totalValue = [...wallets, ...exchanges].reduce((sum, item) => sum + item.valueEUR, 0);

    return {
      id: randomUUID(),
      timestamp,
      totalValueEUR: totalValue,
      change24hPercent: pricingService.randomPercent(),
      change30dPercent: pricingService.randomPercent(),
      change1yPercent: pricingService.randomPercent(),
      wallets,
      exchanges
    };
  }
};
