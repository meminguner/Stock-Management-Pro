// Türkçe karakter dönüşümleri
const turkishToEnglishMap: Record<string, string> = {
  'İ': 'I', 'i': 'I', 'ı': 'I',
  'Ü': 'U', 'ü': 'U',
  'Ş': 'S', 'ş': 'S',
  'Ğ': 'G', 'ğ': 'G',
  'Ç': 'C', 'ç': 'C',
  'Ö': 'O', 'ö': 'O'
};

export const turkishToEnglish = (text: string): string => {
  return text.split('').map(char => turkishToEnglishMap[char] || char).join('');
};

export const normalizeProductText = (input: string): string => {
  return turkishToEnglish(input.trim().toUpperCase());
};

export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

export const formatDate = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Bilinmiyor';
  }
  
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 