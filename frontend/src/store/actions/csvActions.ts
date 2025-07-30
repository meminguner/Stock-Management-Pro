import { createCSVBlob, importFromCSV } from '../../utils/csvUtils';
import { generateUniqueId } from '../../utils/textUtils';
import type { StockItem } from '../types/stockTypes';

// CSV Actions - CSV işlemleri
export const createCSVActions = (set: any, get: any) => ({
  exportToCSV: () => {
    const { items } = get();
    return createCSVBlob(items);
  },

  exportItemsToCSV: (items: StockItem[]) => {
    return createCSVBlob(items);
  },

  importFromCSV: async (file: File) => {
    try {
      const importedItems = await importFromCSV(file);
      
      set((state: any) => {
        const newItems = [...state.items, ...importedItems];
        const allTags = new Set<string>();
        newItems.forEach((item: StockItem) => {
          item.tags.forEach(tag => allTags.add(tag));
        });

        return {
          items: newItems,
          tags: Array.from(allTags),
          hasUnsavedChanges: true
        };
      });
    } catch (error) {
      console.error('CSV import error:', error);
      throw error;
    }
  },

  importAndMergeCSV: async (file: File) => {
    try {
      console.log('importAndMergeCSV başladı');
      const importedItems = await importFromCSV(file);
      console.log('Import edilen items:', importedItems.length);
      
      set((state: any) => {
        console.log('Mevcut state items:', state.items.length);
        // Mevcut ürünlerle birleştir - aynı partNumber varsa stok ekle
        const existingItems = [...state.items];
        const newItems: StockItem[] = [];
        
        importedItems.forEach((importedItem: StockItem) => {
          // Hem name hem de partNumber'a göre eşleştirme yap
          const existingIndex = existingItems.findIndex((item: StockItem) => 
            (item.name === importedItem.name && item.partNumber === importedItem.partNumber) ||
            (item.partNumber === importedItem.partNumber && item.partNumber !== '?' && importedItem.partNumber !== '?')
          );
          
          if (existingIndex !== -1) {
            // Mevcut ürün varsa - yeni ID ver, stokları topla
            const existing = existingItems[existingIndex];
            const newStock = existing.stock === '?' || importedItem.stock === '?' ? '?' :
              (existing.stock as number) + (importedItem.stock as number);
            
            // Mevcut ürünü sil, yeni ID ile yeniden oluştur
            existingItems.splice(existingIndex, 1);
            
            const mergedItem: StockItem = {
              id: generateUniqueId(), // Yeni benzersiz ID
              name: existing.name,
              partNumber: existing.partNumber,
              stock: newStock,
              tags: [...new Set([...existing.tags, ...importedItem.tags])], // Tag'ları birleştir
              createdAt: existing.createdAt, // İlk oluşturulma tarihini koru
              updatedAt: new Date()
            };
            
            newItems.push(mergedItem);
            console.log('🔄 Ürünler birleştirildi:', {
              name: existing.name,
              oldId: existing.id,
              newId: mergedItem.id,
              oldStock: existing.stock,
              importedStock: importedItem.stock,
              newStock: newStock,
              oldTags: existing.tags,
              importedTags: importedItem.tags,
              mergedTags: mergedItem.tags
            });
          } else {
            // Yeni ürün ekle
            newItems.push(importedItem);
            console.log('Yeni ürün eklendi:', importedItem.name);
          }
        });
        
        const finalItems = [...existingItems, ...newItems];
        const allTags = new Set<string>();
        finalItems.forEach((item: StockItem) => {
          item.tags.forEach(tag => allTags.add(tag));
        });

        console.log('Final items sayısı:', finalItems.length);
        return {
          items: finalItems,
          tags: Array.from(allTags),
          hasUnsavedChanges: true
        };
      });
    } catch (error) {
      console.error('CSV merge error:', error);
      throw error;
    }
  },

  importAndReplaceCSV: async (file: File) => {
    try {
      const importedItems = await importFromCSV(file);
      
      set((state: any) => {
        const allTags = new Set<string>();
        importedItems.forEach((item: StockItem) => {
          item.tags.forEach(tag => allTags.add(tag));
        });

        return {
          items: importedItems,
          tags: Array.from(allTags),
          hasUnsavedChanges: true
        };
      });
    } catch (error) {
      console.error('CSV replace error:', error);
      throw error;
    }
  },

  exportAndReplaceCSV: async (file: File) => {
    try {
      console.log('exportAndReplaceCSV başladı');
      
      // Önce mevcut verileri export et
      console.log('Mevcut veriler export ediliyor...');
      const { items } = get();
      console.log('Mevcut items sayısı:', items.length);
      const currentBlob = createCSVBlob(items);
      console.log('Export blob oluşturuldu:', currentBlob.size, 'bytes');
      
      const url = URL.createObjectURL(currentBlob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
      a.download = `stock_takip_${dateStr}_${timeStr}_backup.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Export tamamlandı');

      // Sonra yeni CSV'yi yükle
      console.log('Yeni CSV yükleniyor...');
      const importedItems = await importFromCSV(file);
      console.log('Import edilen items:', importedItems.length);
      
      set((state: any) => {
        console.log('State güncelleniyor...');
        const allTags = new Set<string>();
        importedItems.forEach((item: StockItem) => {
          item.tags.forEach(tag => allTags.add(tag));
        });

        const newState = {
          items: importedItems,
          tags: Array.from(allTags),
          hasUnsavedChanges: true
        };
        console.log('Yeni state:', newState);
        return newState;
      });
      
      console.log('exportAndReplaceCSV tamamlandı');
    } catch (error) {
      console.error('Export and replace error:', error);
      throw error;
    }
  }
}); 