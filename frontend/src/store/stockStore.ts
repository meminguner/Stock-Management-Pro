import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StockStore } from './types/stockTypes';
import { createItemActions } from './actions/itemActions';
import { createTagActions } from './actions/tagActions';
import { createCSVActions } from './actions/csvActions';
import { createSearchActions } from './actions/searchActions';
import { createStateActions } from './actions/stateActions';

// Yeni Stock Store - Bölünmüş yapı
export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      tags: [],
      hasUnsavedChanges: false,
      searchQuery: '',
      filteredItems: [],

      // Actions - Bölünmüş dosyalardan import ediliyor
      ...createItemActions(set, get),
      ...createTagActions(set, get),
      ...createCSVActions(set, get),
      ...createSearchActions(set, get),
      ...createStateActions(set, get)
    }),
    {
      name: 'stock-app-storage',
      partialize: (state) => ({
        items: state.items,
        tags: state.tags
      }),
      storage: {
        getItem: (name: string) => {
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
        setItem: (name: string, value: string) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        }
      } as any
    }
  )
); 