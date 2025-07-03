/**
 * Caching utility for Constitution.mt
 * 
 * Provides in-memory caching with optional Redis fallback
 * for constitution data and search results
 */

import { Article, Chapter } from '@/types/constitution';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100; // Maximum number of cached items
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired items every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set<T>(key: string, data: T, ttlMs: number = 60 * 60 * 1000): void { // Default 1 hour TTL
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Global memory cache instance
const memoryCache = new MemoryCache();

// Cache key generators
const cacheKeys = {
  chapter: (chapterNumber: number) => `chapter:${chapterNumber}`,
  article: (chapterNumber: number, articleNumber: number) => `article:${chapterNumber}:${articleNumber}`,
  chapterArticles: (chapterNumber: number) => `chapter_articles:${chapterNumber}`,
  allChapters: () => 'all_chapters',
  searchResults: (query: string, options?: any) => {
    const optionsKey = options ? JSON.stringify(options) : '';
    return `search:${query}:${optionsKey}`;
  },
  constitutionStructure: () => 'constitution_structure'
};

// Cache TTL configurations (in milliseconds)
const cacheTTL = {
  constitution: 24 * 60 * 60 * 1000, // 24 hours - constitution data rarely changes
  search: 30 * 60 * 1000,            // 30 minutes - search results can be cached briefly
  structure: 24 * 60 * 60 * 1000,    // 24 hours - structure rarely changes
};

// Main caching functions
export const cache = {
  // Article caching
  async getArticle(chapterNumber: number, articleNumber: number): Promise<Article | null> {
    const key = cacheKeys.article(chapterNumber, articleNumber);
    return memoryCache.get<Article>(key);
  },

  setArticle(chapterNumber: number, articleNumber: number, article: Article): void {
    const key = cacheKeys.article(chapterNumber, articleNumber);
    memoryCache.set(key, article, cacheTTL.constitution);
  },

  // Chapter caching
  async getChapter(chapterNumber: number): Promise<Chapter | null> {
    const key = cacheKeys.chapter(chapterNumber);
    return memoryCache.get<Chapter>(key);
  },

  setChapter(chapterNumber: number, chapter: Chapter): void {
    const key = cacheKeys.chapter(chapterNumber);
    memoryCache.set(key, chapter, cacheTTL.constitution);
  },

  // Chapter articles caching
  async getChapterArticles(chapterNumber: number): Promise<Article[] | null> {
    const key = cacheKeys.chapterArticles(chapterNumber);
    return memoryCache.get<Article[]>(key);
  },

  setChapterArticles(chapterNumber: number, articles: Article[]): void {
    const key = cacheKeys.chapterArticles(chapterNumber);
    memoryCache.set(key, articles, cacheTTL.constitution);
  },

  // All chapters caching
  async getAllChapters(): Promise<Chapter[] | null> {
    const key = cacheKeys.allChapters();
    return memoryCache.get<Chapter[]>(key);
  },

  setAllChapters(chapters: Chapter[]): void {
    const key = cacheKeys.allChapters();
    memoryCache.set(key, chapters, cacheTTL.constitution);
  },

  // Search results caching
  async getSearchResults(query: string, options?: any): Promise<any | null> {
    const key = cacheKeys.searchResults(query, options);
    return memoryCache.get(key);
  },

  setSearchResults(query: string, results: any, options?: any): void {
    const key = cacheKeys.searchResults(query, options);
    memoryCache.set(key, results, cacheTTL.search);
  },

  // Constitution structure caching
  async getConstitutionStructure(): Promise<any | null> {
    const key = cacheKeys.constitutionStructure();
    return memoryCache.get(key);
  },

  setConstitutionStructure(structure: any): void {
    const key = cacheKeys.constitutionStructure();
    memoryCache.set(key, structure, cacheTTL.structure);
  },

  // Utility functions
  invalidateChapter(chapterNumber: number): void {
    memoryCache.delete(cacheKeys.chapter(chapterNumber));
    memoryCache.delete(cacheKeys.chapterArticles(chapterNumber));
    // Also invalidate all chapters cache
    memoryCache.delete(cacheKeys.allChapters());
  },

  invalidateArticle(chapterNumber: number, articleNumber: number): void {
    memoryCache.delete(cacheKeys.article(chapterNumber, articleNumber));
    // Also invalidate the chapter articles cache
    memoryCache.delete(cacheKeys.chapterArticles(chapterNumber));
  },

  invalidateSearch(query?: string): void {
    if (query) {
      // Find and delete specific search results
      const searchKey = cacheKeys.searchResults(query);
      memoryCache.delete(searchKey);
    } else {
      // Clear all search caches (would need to iterate through keys)
      // For now, we'll just clear everything - not ideal but simple
      memoryCache.clear();
    }
  },

  clearAll(): void {
    memoryCache.clear();
  },

  getStats() {
    return memoryCache.getStats();
  }
};

// Wrapper function to add caching to any async function
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl: number = cacheTTL.constitution
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);
    
    // Try to get from cache first
    const cached = memoryCache.get<R>(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, execute function and cache result
    const result = await fn(...args);
    memoryCache.set(key, result, ttl);
    
    return result;
  };
}

// High-level caching decorator for constitution functions
export function cached(ttl: number = cacheTTL.constitution) {
  return function<T extends any[], R>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const method = descriptor.value!;
    
    descriptor.value = async function(...args: T): Promise<R> {
      const key = `${propertyName}:${JSON.stringify(args)}`;
      
      const cached = memoryCache.get<R>(key);
      if (cached !== null) {
        return cached;
      }

      const result = await method.apply(this, args);
      memoryCache.set(key, result, ttl);
      
      return result;
    };
  };
}

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    memoryCache.destroy();
  });
}