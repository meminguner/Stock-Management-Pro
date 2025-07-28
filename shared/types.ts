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

export interface TagManager {
  addTag(tag: string): void;
  getAvailableTags(): string[];
  filterTagSuggestions(input: string): string[];
}

export interface CSVExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
}

export interface AppInfo {
  productCount: number;
  tagCount: number;
  storage: {
    storageSize: number;
    localStorageAvailable: boolean;
  };
  hasUnsavedChanges: boolean;
} 