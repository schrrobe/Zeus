import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../utils/numberFormat';

describe('formatCurrency', () => {
  it('formats euros with german locale', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56\u00a0€');
  });
});
