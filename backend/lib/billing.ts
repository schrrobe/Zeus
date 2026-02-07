export const FREE_INVOICE_LIMIT = 10;
export const PAID_PLAN_PRICE_EUR = 99;

export function isWithinFreeLimit(invoiceCount: number) {
  return invoiceCount <= FREE_INVOICE_LIMIT;
}

export function getPlanStatus(invoiceCount: number) {
  return isWithinFreeLimit(invoiceCount) ? 'free' : 'paid';
}
