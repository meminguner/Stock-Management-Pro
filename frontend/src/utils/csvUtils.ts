// Inline interface tanımı
interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Proper CSV parsing function - handles quoted strings with commas
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
};

export const createCSVBlob = (items: StockItem[]): Blob => {
  // CSV format: ID,Ürün Adı,Ürün Kodu,Kategori,Stok
  const headers = ['ID', 'Ürün Adı', 'Ürün Kodu', 'Kategori', 'Stok'];
  
  const csvContent = [
    headers.join(','),
    ...items.map(item => [
      item.id,
      `"${item.name}"`,
      `"${item.partNumber}"`,
      `"${item.tags.join(' ')}"`, // Kategorileri space ile birleştir
      item.stock
    ].join(','))
  ].join('\n');

  // YYYY-MM-DD_HHMM formatı (saniye yok)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
  const filename = `stock_takip_${dateStr}_${timeStr}.csv`;
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const importFromCSV = (file: File): Promise<StockItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        // Header kontrolü - CSV format: ID,Ürün Adı,Ürün Kodu,Kategori,Stok
        const headers = parseCSVLine(lines[0]);
        console.log('CSV Headers:', headers);
        
        const items: StockItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = parseCSVLine(line);
          if (values.length < 5) continue;
          
          // CSV format: ID,Ürün Adı,Ürün Kodu,Kategori,Stok
          const [id, name, partNumber, category, stock] = values;
          
          // Quote'ları temizle
          const cleanName = name.replace(/^"|"$/g, '');
          const cleanPartNumber = partNumber.replace(/^"|"$/g, '');
          const cleanCategory = category.replace(/^"|"$/g, '');
          
          // Kategoriyi tags array'e çevir - boşlukla ayrılmış etiketleri parse et
          const tags = cleanCategory ? 
            cleanCategory.trim()
              .split(/\s+/) // Boşluklarla ayır (birden fazla boşluk da destekle)
              .map(tag => tag.trim().toUpperCase()) // Her tag'ı temizle ve büyük harfe çevir
              .filter(tag => tag.length > 0) // Boş tag'ları filtrele
            : [];
          
          // Stok değerini parse et
          const stockValue = stock === '?' || stock === '"?"' ? '?' : 
                           !isNaN(parseInt(stock, 10)) ? parseInt(stock, 10) : '?';
          
          items.push({
            id: id || generateUniqueId(),
            name: normalizeProductText(cleanName),
            partNumber: normalizeProductText(cleanPartNumber),
            stock: stockValue,
            tags,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        console.log('Parsed items:', items);
        resolve(items);
      } catch (error) {
        console.error('CSV parse error:', error);
        reject(new Error('CSV dosyası okunamadı'));
      }
    };
    
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsText(file);
  });
};

// Helper functions
const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

const normalizeProductText = (input: string): string => {
  const turkishToEnglishMap: Record<string, string> = {
    'İ': 'I', 'i': 'I', 'ı': 'I',
    'Ü': 'U', 'ü': 'U',
    'Ş': 'S', 'ş': 'S',
    'Ğ': 'G', 'ğ': 'G',
    'Ç': 'C', 'ç': 'C',
    'Ö': 'O', 'ö': 'O'
  };
  
  return input.split('').map(char => turkishToEnglishMap[char] || char).join('').trim().toUpperCase();
}; 