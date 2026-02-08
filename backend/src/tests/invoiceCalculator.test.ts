import { describe, it, expect } from 'vitest';
import { calculateTotals } from '../services/invoiceCalculator';

describe('calculateTotals', () => {
  it('calculates subtotal, tax, and total', () => {
    const totals = calculateTotals(
      [
        { description: 'Line 1', quantity: 2, unitPrice: 1000, taxRate: 19 },
        { description: 'Line 2', quantity: 1, unitPrice: 500, taxRate: 7 }
      ],
      100
    );

    expect(totals.subtotalCents).toBe(2500);
    expect(totals.taxCents).toBe(415);
    expect(totals.discountCents).toBe(100);
    expect(totals.totalCents).toBe(totals.subtotalCents + totals.taxCents - totals.discountCents);
  });
});
