// Stock Types - Tüm interface tanımları
export interface StockItem {
  id: string;
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StockItemInput {
  name: string;
  partNumber: string;
  stock: number | '?';
  tags: string[];
}

export interface StockItemUpdate {
  id: string;
  name?: string;
  partNumber?: string;
  stock?: number | '?';
  tags?: string[];
}

export interface StockState {
  items: StockItem[];
  tags: string[];
  hasUnsavedChanges: boolean;
  searchQuery: string;
  filteredItems: StockItem[];
}

export interface StockActions {
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

export type StockStore = StockState & StockActions; 