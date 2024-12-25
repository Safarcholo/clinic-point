export function useSearch(items, searchTerm, fields = ['name', 'phone']) {
  return useMemo(() => {
    if (!searchTerm) return items;
    
    const searchLower = searchTerm.toLowerCase();
    return items.filter(item => 
      fields.some(field => 
        item[field]?.toLowerCase().includes(searchLower)
      )
    );
  }, [items, searchTerm, fields]);
} 