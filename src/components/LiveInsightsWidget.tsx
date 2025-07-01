import { useState, useEffect, memo, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChartBarIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useActiveUsersStore } from '@/lib/activeUsersStore';
import { isBrowser, getBaseUrl } from '@/lib/utils';

interface TopArticle {
  chapter: number;
  article: number;
  views: number;
  title?: string;
}

interface TopSearch {
  term: string;
  count: number;
}

const LiveInsightsWidget = memo(function LiveInsightsWidget({ className = '' }: { className?: string }) {
  const [topArticle, setTopArticle] = useState<TopArticle | null>(null);
  const [topSearch, setTopSearch] = useState<TopSearch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Use the shared store for active users count instead of fetching separately
  const { count: activeUsers } = useActiveUsersStore();

  useEffect(() => {
    // Track if component is mounted
    setMounted(true);
    
    // Skip on server-side
    if (!isBrowser()) return;
    
    const fetchInsights = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching insights for LiveInsightsWidget...');
        
        const baseUrl = getBaseUrl();
        
        // Fetch top article
        const articlesRes = await fetch(`${baseUrl}/api/analytics/top-articles?timeframe=day&limit=1`);
        if (!articlesRes.ok) {
          console.error(`Error fetching top articles: ${articlesRes.status} ${articlesRes.statusText}`);
          throw new Error('Failed to fetch top articles');
        }
        const articles = await articlesRes.json();
        console.log('Top articles response:', articles);
        
        // Fetch top search
        const searchesRes = await fetch(`${baseUrl}/api/analytics/top-searches?timeframe=day&limit=1`);
        if (!searchesRes.ok) {
          console.error(`Error fetching top searches: ${searchesRes.status} ${searchesRes.statusText}`);
          throw new Error('Failed to fetch top searches');
        }
        const searches = await searchesRes.json();
        console.log('Top searches response:', searches);
        
        // No need to fetch active users here anymore since we're using the shared store
        
        if (articles && articles.length > 0) setTopArticle(articles[0]);
        if (searches && searches.length > 0) setTopSearch(searches[0]);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
    
    // Reduce refresh frequency from 60s to 120s (2 minutes)
    const interval = setInterval(fetchInsights, 120 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Don't render anything until after hydration to avoid layout shift
  if (!mounted) return null;
  
  // If there's no data and still loading, show a placeholder
  if (loading && !topArticle && !topSearch && activeUsers === 0) {
    return (
      <div className={`bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
        <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-primary-DEFAULT dark:text-primary-400" />
          Live Insights
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
        <ChartBarIcon className="w-5 h-5 mr-2 text-primary-DEFAULT dark:text-primary-400" />
        Live Insights
      </h3>
      
      <div className="space-y-3">
        {topArticle && (
          <motion.div 
            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <ChartBarIcon className="w-4 h-4 mr-2 text-primary-DEFAULT/70 dark:text-primary-400/70" />
              Most Read Today:
            </span>
            <div className="flex flex-col items-end">
              <Link 
                href={`/constitution/chapter/${topArticle.chapter}/article/${topArticle.article}`}
                className="text-sm font-medium text-primary-DEFAULT dark:text-primary-400 hover:underline"
              >
                Article {topArticle.article}
              </Link>
              <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate" title={topArticle.title || ''}>
                {topArticle.title || ''} <span>({topArticle.views} views)</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {topSearch && (
          <motion.div 
            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-blue-500/70 dark:text-blue-400/70" />
              Top Search:
            </span>
            <Link 
              href={`/search?q=${encodeURIComponent(topSearch.term)}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              "{topSearch.term}"
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({topSearch.count} searches)</span>
            </Link>
          </motion.div>
        )}
        
        <motion.div 
          className="flex justify-between items-center py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-2 text-green-500/70 dark:text-green-400/70" />
            Reading Right Now:
          </span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
            {activeUsers} {activeUsers === 1 ? 'person' : 'people'}
          </span>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link 
          href="/analytics" 
          className="text-sm text-primary-DEFAULT dark:text-primary-400 hover:underline inline-flex items-center"
        >
          <span>View Full Analytics</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
});

export default LiveInsightsWidget; 