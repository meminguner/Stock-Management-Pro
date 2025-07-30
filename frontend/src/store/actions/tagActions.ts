// Tag Actions - Tag işlemleri
export const createTagActions = (set: any, get: any) => ({
  addTag: (tag: string) => {
    const normalizedTag = tag.trim().toUpperCase();
    if (!normalizedTag) return;

    set((state: any) => ({
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
    
    return tags.filter((tag: string) => 
      tag.includes(normalizedInput) && tag !== normalizedInput
    );
  }
}); 