'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { trackSearch } from '@/lib/analytics';
import { isInappropriateSearchTerm } from '@/lib/content-filters';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

interface SearchProps {
  initialQuery?: string;
  onSearch?: (query: string, filters?: SearchFilters) => void;
  showFilters?: boolean;
}

interface SearchFilters {
  chapter?: number;
  matchType?: 'all' | 'title' | 'content' | 'exact';
}

interface Suggestion {
  text: string;
  type: 'term' | 'article' | 'chapter';
}

export default function EnhancedSearch({ 
  initialQuery = '', 
  onSearch, 
  showFilters = true 
}: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced suggestions fetching
  const debouncedFetchSuggestions = useMemo(() => {
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    
    return (searchQuery: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(async () => {
        if (searchQuery.length < 2) {
          setSuggestions([]);
          return;
        }
        
        if (isInappropriateSearchTerm(searchQuery)) {
          setSuggestions([]);
          return;
        }
        
        try {
          const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=8`);
          const data = await response.json();
          
          const formattedSuggestions: Suggestion[] = data.suggestions.map((suggestion: string) => ({
            text: suggestion,
            type: 'term' as const
          }));
          
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
    };
  }, []);

  useEffect(() => {
    if (query) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, debouncedFetchSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          selectSuggestion(suggestions[selectedSuggestion].text);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    
    // Trigger search immediately
    setTimeout(() => handleSearch(suggestion), 0);
  };

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    
    if (!searchTerm.trim()) return;
    
    if (isInappropriateSearchTerm(searchTerm)) {
      // Handle inappropriate search terms
      return;
    }

    setIsLoading(true);
    
    // Track the search
    trackSearch(searchTerm);
    
    if (onSearch) {
      onSearch(searchTerm, filters);
    } else {
      // Build query string with filters
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      
      if (filters.chapter) {
        params.set('chapter', filters.chapter.toString());
      }
      if (filters.matchType && filters.matchType !== 'all') {
        params.set('type', filters.matchType);
      }
      
      router.push(`/search?${params.toString()}`);
    }
    
    setShowSuggestions(false);
    setIsLoading(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder="Search articles, rights, principles..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent transition-all duration-200"
              aria-label="Search the Constitution"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`ml-2 p-3 rounded-lg border transition-colors ${
                showFiltersPanel || Object.keys(filters).length > 0
                  ? 'bg-primary-DEFAULT text-white border-primary-DEFAULT'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="Search filters"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            className="ml-2 px-6 py-3 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => selectSuggestion(suggestion.text)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  index === selectedSuggestion 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-DEFAULT' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{suggestion.text}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            {/* Chapter Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="chapter-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chapter:
              </label>
              <select
                id="chapter-filter"
                value={filters.chapter || ''}
                onChange={(e) => updateFilter('chapter', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">All Chapters</option>
                {Array.from({ length: 11 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Chapter {num}</option>
                ))}
              </select>
            </div>

            {/* Match Type Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="match-type-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Match:
              </label>
              <select
                id="match-type-filter"
                value={filters.matchType || 'all'}
                onChange={(e) => updateFilter('matchType', e.target.value as SearchFilters['matchType'])}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Content</option>
                <option value="title">Title Only</option>
                <option value="content">Content Only</option>
                <option value="exact">Exact Phrase</option>
              </select>
            </div>

            {/* Clear Filters */}
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-sm text-primary-DEFAULT hover:text-primary-800 underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}