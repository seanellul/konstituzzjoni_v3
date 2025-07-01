import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface SearchResult {
  relevanceScore: number;
  matchType: 'title' | 'content' | 'tag' | 'cross-reference';
  matchedText?: string;
  number: number;
  title: string;
  chapterNumber: number;
  chapterTitle: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions?: string[];
  facets?: {
    chapters: { number: number; title: string; count: number }[];
    tags: { tag: string; count: number }[];
  };
}

interface UseSearchOptions {
  debounceMs?: number;
  enableFacets?: boolean;
  limit?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, enableFacets = true, limit = 20 } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facets, setFacets] = useState<SearchResponse['facets']>();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, debounceMs);
  
  const performSearch = useCallback(async (searchQuery: string, searchOptions?: {
    chapter?: number;
    matchType?: string;
  }) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      setFacets(undefined);
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      params.set('limit', limit.toString());
      
      if (enableFacets) {
        params.set('metadata', 'true');
      }
      
      if (searchOptions?.chapter) {
        params.set('chapter', searchOptions.chapter.toString());
      }
      
      if (searchOptions?.matchType) {
        params.set('type', searchOptions.matchType);
      }
      
      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data: SearchResponse = await response.json();
      
      setResults(data.results || []);
      setTotal(data.total || 0);
      setFacets(data.facets);
      setSuggestions(data.suggestions || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setTotal(0);
      setFacets(undefined);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [limit, enableFacets]);
  
  // Memoized search results for better performance
  const memoizedResults = useMemo(() => ({
    results,
    total,
    facets,
    suggestions,
    loading,
    error
  }), [results, total, facets, suggestions, loading, error]);
  
  // Clear search function
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setFacets(undefined);
    setSuggestions([]);
    setError(null);
  }, []);
  
  // Auto-search when debounced query changes
  // useEffect(() => {
  //   if (debouncedQuery) {
  //     performSearch(debouncedQuery);
  //   }
  // }, [debouncedQuery, performSearch]);
  
  return {
    query,
    setQuery,
    debouncedQuery,
    search: performSearch,
    clearSearch,
    ...memoizedResults
  };
}