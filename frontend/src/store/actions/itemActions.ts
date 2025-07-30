import { generateUniqueId, normalizeProductText } from '../../utils/textUtils';
import { parseStockValue } from '../../utils/stockUtils';
import type { StockItem, StockItemInput, StockItemUpdate } from '../types/stockTypes';

// Item Actions - Ürün işlemleri
export const createItemActions = (set: any, get: any) => ({
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

    set((state: any) => {
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
    set((state: any) => {
      const updatedItems = state.items.map((item: StockItem) => {
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
      updatedItems.forEach((item: StockItem) => {
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
    set((state: any) => {
      const newItems = state.items.filter((item: StockItem) => item.id !== id);
      
      // Rebuild tags from remaining items
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
  },

  updateStock: (id: string, stock: number | '?') => {
    set((state: any) => ({
      items: state.items.map((item: StockItem) =>
        item.id === id ? { ...item, stock, updatedAt: new Date() } : item
      ),
      hasUnsavedChanges: true
    }));
  },

  incrementStock: (id: string) => {
    set((state: any) => ({
      items: state.items.map((item: StockItem) => {
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
    set((state: any) => ({
      items: state.items.map((item: StockItem) => {
        if (item.id === id) {
          const newStock = item.stock === '?' ? 0 : Math.max(0, item.stock - 1);
          return { ...item, stock: newStock, updatedAt: new Date() };
        }
        return item;
      }),
      hasUnsavedChanges: true
    }));
  }
}); 