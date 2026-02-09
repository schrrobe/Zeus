type NumberingSettings = {
  prefix: string;
  nextNumber: number;
  startNumber: number;
  minDigits: number;
  resetYearly: boolean;
  currentYear: number | null;
};

export const formatNumberText = ({ prefix, number, minDigits }: { prefix: string; number: number; minDigits: number }) => {
  const safeDigits = Math.max(minDigits, 1);
  return `${prefix}${String(number).padStart(safeDigits, '0')}`;
};

export const getNextNumbering = (settings: NumberingSettings, year: number) => {
  const shouldReset = settings.resetYearly && settings.currentYear !== null && settings.currentYear !== year;
  const baseNumber = shouldReset ? settings.startNumber : settings.nextNumber;
  const number = baseNumber;
  const nextNumber = baseNumber + 1;
  const currentYear = settings.resetYearly ? year : settings.currentYear;
  return {
    number,
    nextNumber,
    numberText: formatNumberText({ prefix: settings.prefix, number, minDigits: settings.minDigits }),
    currentYear
  };
};
