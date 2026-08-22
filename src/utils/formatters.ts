export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const maskSensitiveNumber = (val: string, visibleDigitsCount: number = 4): string => {
  if (!val) return '••••';
  const clean = val.replace(/\s+/g, '');
  if (clean.length <= visibleDigitsCount) return '••••' + clean;
  const suffix = clean.slice(-visibleDigitsCount);
  return `•••• •••• ${suffix}`;
};

export const maskTaxId = (val: string): string => {
  if (!val) return '••••••••';
  if (val.startsWith('•')) return val;
  const lastFour = val.slice(-4);
  return `••••••${lastFour}`;
};
