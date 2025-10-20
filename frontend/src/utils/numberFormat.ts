const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2
});

export function formatCurrency(value: number) {
  return formatter.format(value);
}
