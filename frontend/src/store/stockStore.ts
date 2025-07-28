import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUniqueId, normalizeProductText } from '../utils/textUtils';
import { parseStockValue } from '../utils/stockUtils';
import { createCSVBlob, importFromCSV } from '../utils/csvUtils';

// Inline interface tanımları
interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface StockItemInput {
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
}

interface StockItemUpdate {
  id: string;
  name?: string;
  partNumber?: string;
  stock?: number | '?';
  tags?: string[];
}

interface StockState {
  items: StockItem[];
  tags: string[];
  hasUnsavedChanges: boolean;
  searchQuery: string;
  filteredItems: StockItem[];
}

interface StockActions {
  // Item operations
  addItem: (input: StockItemInput) => void;
  updateItem: (update: StockItemUpdate) => void;
  deleteItem: (id: string) => void;
  updateStock: (id: string, stock: number | '?') => void;
  incrementStock: (id: string) => void;
  decrementStock: (id: string) => void;
  
  // Tag operations
  addTag: (tag: string) => void;
  getAvailableTags: () => string[];
  filterTagSuggestions: (input: string) => string[];
  
  // Search and filter
  setSearchQuery: (query: string) => void;
  getFilteredItems: () => StockItem[];
  
  // CSV operations
  exportToCSV: () => Blob;
  importFromCSV: (file: File) => Promise<void>;
  importAndMergeCSV: (file: File) => Promise<void>;
  importAndReplaceCSV: (file: File) => Promise<void>;
  exportAndReplaceCSV: (file: File) => Promise<void>;
  
  // State management
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  getAppInfo: () => {
    productCount: number;
    tagCount: number;
    storage: { storageSize: number; localStorageAvailable: boolean };
    hasUnsavedChanges: boolean;
  };
}

type StockStore = StockState & StockActions;

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      tags: [],
      hasUnsavedChanges: false,
      searchQuery: '',
      filteredItems: [],

      // Item operations
      addItem: (input: StockItemInput) => {
        const newItem: StockItem = {
          id: generateUniqueId(),
          name: normalizeProductText(input.name),
          partNumber: normalizeProductText(input.partNumber),
          stock: parseStockValue(input.stock.toString()),
          tags: input.tags.filter(tag => tag.trim()),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => {
          const newItems = [...state.items, newItem];
          const newTags = [...new Set([...state.tags, ...input.tags])];
          
          return {
            items: newItems,
            tags: newTags,
            hasUnsavedChanges: true
          };
        });
      },

      updateItem: (update: StockItemUpdate) => {
        set(state => {
          const updatedItems = state.items.map(item => {
            if (item.id === update.id) {
              return {
                ...item,
                name: update.name ? normalizeProductText(update.name) : item.name,
                partNumber: update.partNumber ? normalizeProductText(update.partNumber) : item.partNumber,
                stock: update.stock !== undefined ? parseStockValue(update.stock.toString()) : item.stock,
                tags: update.tags || item.tags,
                updatedAt: new Date()
              };
            }
            return item;
          });

          // Update tags from all items
          const allTags = new Set<string>();
          updatedItems.forEach(item => {
            item.tags.forEach(tag => allTags.add(tag));
          });

          return {
            items: updatedItems,
            tags: Array.from(allTags),
            hasUnsavedChanges: true
          };
        });
      },

      deleteItem: (id: string) => {
        set(state => {
          const newItems = state.items.filter(item => item.id !== id);
          
          // Rebuild tags from remaining items
          const allTags = new Set<string>();
          newItems.forEach(item => {
            item.tags.forEach(tag => allTags.add(tag));
          });

          return {
            items: newItems,
            tags: Array.from(allTags),
            hasUnsavedChanges: true
          };
        });
      },

      updateStock: (id: string, stock: number | '?') => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, stock, updatedAt: new Date() } : item
          ),
          hasUnsavedChanges: true
        }));
      },

      incrementStock: (id: string) => {
        set(state => ({
          items: state.items.map(item => {
            if (item.id === id) {
              const newStock = item.stock === '?' ? 1 : item.stock + 1;
              return { ...item, stock: newStock, updatedAt: new Date() };
            }
            return item;
          }),
          hasUnsavedChanges: true
        }));
      },

      decrementStock: (id: string) => {
        set(state => ({
          items: state.items.map(item => {
            if (item.id === id) {
              const newStock = item.stock === '?' ? 0 : Math.max(0, item.stock - 1);
              return { ...item, stock: newStock, updatedAt: new Date() };
            }
            return item;
          }),
          hasUnsavedChanges: true
        }));
      },

      // Tag operations
      addTag: (tag: string) => {
        const normalizedTag = tag.trim().toUpperCase();
        if (!normalizedTag) return;

        set(state => ({
          tags: [...new Set([...state.tags, normalizedTag])]
        }));
      },

      getAvailableTags: () => {
        return get().tags;
      },

      filterTagSuggestions: (input: string) => {
        const { tags } = get();
        const normalizedInput = input.trim().toUpperCase();
        
        if (!normalizedInput) return tags;
        
        return tags.filter(tag => 
          tag.includes(normalizedInput) && tag !== normalizedInput
        );
      },

      // Search and filter
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      getFilteredItems: () => {
        const { items, searchQuery } = get();
        
        if (!searchQuery.trim()) return items;
        
        const normalizedQuery = searchQuery.toLowerCase();
        
        return items.filter(item =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.partNumber.toLowerCase().includes(normalizedQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
      },

      // CSV operations
      exportToCSV: () => {
        const { items } = get();
        return createCSVBlob(items);
      },

      // Export fonksiyonu (items parametresi ile)
      exportItemsToCSV: (items: StockItem[]) => {
        return createCSVBlob(items);
      },

      importFromCSV: async (file: File) => {
        try {
          const importedItems = await importFromCSV(file);
          
          set(state => {
            const newItems = [...state.items, ...importedItems];
            const allTags = new Set<string>();
            newItems.forEach(item => {
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

      // Yeni import fonksiyonları
      importAndMergeCSV: async (file: File) => {
        try {
          console.log('importAndMergeCSV başladı');
          const importedItems = await importFromCSV(file);
          console.log('Import edilen items:', importedItems.length);
          
          set(state => {
            console.log('Mevcut state items:', state.items.length);
            // Mevcut ürünlerle birleştir - aynı partNumber varsa stok ekle
            const existingItems = [...state.items];
            const newItems: StockItem[] = [];
            
            importedItems.forEach(importedItem => {
              const existingIndex = existingItems.findIndex(item => 
                item.partNumber === importedItem.partNumber
              );
              
              if (existingIndex !== -1) {
                // Mevcut ürün varsa stok ekle
                const existing = existingItems[existingIndex];
                const newStock = existing.stock === '?' || importedItem.stock === '?' ? '?' :
                  (existing.stock as number) + (importedItem.stock as number);
                
                existingItems[existingIndex] = {
                  ...existing,
                  stock: newStock,
                  updatedAt: new Date()
                };
                console.log('Mevcut ürün güncellendi:', existing.name, 'yeni stok:', newStock);
              } else {
                // Yeni ürün ekle
                newItems.push(importedItem);
                console.log('Yeni ürün eklendi:', importedItem.name);
              }
            });
            
            const finalItems = [...existingItems, ...newItems];
            const allTags = new Set<string>();
            finalItems.forEach(item => {
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
          
          set(state => {
            const allTags = new Set<string>();
            importedItems.forEach(item => {
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

      // Export + temizleme + yükleme fonksiyonu
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
          
          set(state => {
            console.log('State güncelleniyor...');
            const allTags = new Set<string>();
            importedItems.forEach(item => {
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
      },

      // State management
      setHasUnsavedChanges: (hasChanges: boolean) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      getAppInfo: () => {
        const { items, tags, hasUnsavedChanges } = get();
        
        return {
          productCount: items.length,
          tagCount: tags.length,
          storage: {
            storageSize: JSON.stringify({ items, tags }).length,
            localStorageAvailable: typeof localStorage !== 'undefined'
          },
          hasUnsavedChanges
        };
      }
    }),
    {
      name: 'stock-app-storage',
      partialize: (state) => ({
        items: state.items,
        tags: state.tags
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const data = JSON.parse(str);
            // Date objelerini restore et
            if (data.state?.items) {
              data.state.items = data.state.items.map((item: any) => ({
                ...item,
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
              }));
            }
            return JSON.stringify(data);
          } catch {
            return str;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
); 