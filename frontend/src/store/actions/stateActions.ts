// State Actions - State yönetimi işlemleri
export const createStateActions = (set: any, get: any) => ({
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
}); 