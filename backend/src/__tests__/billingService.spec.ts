import { describe, expect, it, beforeEach } from 'vitest';
import { billingService } from '../services/billingService';

describe('billingService', () => {
  beforeEach(async () => {
    await billingService.recordSubscription('user-1', 'monthly');
  });

  it('computes summary with premium revenue', async () => {
    const summary = await billingService.summary();
    expect(summary.monthlyRecurringRevenueEUR).toBeGreaterThanOrEqual(5);
  });
});
