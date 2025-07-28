export const validateStockInput = (input: string): string => {
  // Sadece rakam ve ? karakteri
  const cleaned = input.replace(/[^0-9?]/g, '');
  return cleaned || '?';
};

export const isValidStockCharacter = (char: string): boolean => {
  return /[0-9?]/.test(char);
};

export const parseStockValue = (value: string): number | '?' => {
  if (value === '?' || value === '') return '?';
  const num = parseInt(value, 10);
  return isNaN(num) ? '?' : num;
};

export const formatStockValue = (value: number | '?'): string => {
  return value === '?' ? '?' : value.toString();
};

export const incrementStock = (current: number | '?'): number | '?' => {
  if (current === '?') return 1;
  return current + 1;
};

export const decrementStock = (current: number | '?'): number | '?' => {
  if (current === '?') return 0;
  return Math.max(0, current - 1);
}; 