export type LineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
};

export type Totals = {
  subtotalCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
};

export const calculateTotals = (lines: LineInput[], discountCents = 0): Totals => {
  const subtotalCents = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const taxCents = lines.reduce((sum, line) => {
    const rate = line.taxRate ?? 0;
    return sum + Math.round((line.quantity * line.unitPrice * rate) / 100);
  }, 0);
  const totalCents = Math.max(0, subtotalCents + taxCents - discountCents);
  return { subtotalCents, taxCents, discountCents, totalCents };
};
