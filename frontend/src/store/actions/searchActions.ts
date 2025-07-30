// Search Actions - Arama ve filtreleme işlemleri
export const createSearchActions = (set: any, get: any) => ({
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getFilteredItems: () => {
    const { items, searchQuery } = get();
    
    if (!searchQuery.trim()) return items;
    
    const normalizedQuery = searchQuery.toLowerCase();
    
    return items.filter((item: any) =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.partNumber.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(normalizedQuery))
    );
  }
}); 