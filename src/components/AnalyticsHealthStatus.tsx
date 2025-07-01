'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime: number;
  };
  analytics: {
    tablesExist: boolean;
    dataCount: {
      pageViews: number;
      articleViews: number;
      chapterViews: number;
      searchQueries: number;
      activeUsers: number;
    };
    recentActivity: {
      lastPageView: string | null;
      lastSearch: string | null;
      sessionCount24h: number;
    };
  };
  performance: {
    apiResponseTime: number;
  };
  issues: string[];
}

export default function AnalyticsHealthStatus() {
  const [healthData, setHealthData] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/health');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      } else {
        console.error('Failed to fetch health data');
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // Check health every 2 minutes
    const interval = setInterval(fetchHealthData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ServerIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatLastActivity = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading && !healthData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <XCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Health check failed</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(healthData.status)}
          <h3 className={`text-lg font-semibold ${getStatusColor(healthData.status)}`}>
            System Health: {healthData.status.charAt(0).toUpperCase() + healthData.status.slice(1)}
          </h3>
        </div>
        <button
          onClick={fetchHealthData}
          disabled={loading}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="text-sm text-gray-500 dark:text-gray-400">Database</div>
          <div className="flex items-center space-x-2">
            {healthData.database.connected ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm font-medium dark:text-gray-200">
              {healthData.database.connected ? 'Connected' : 'Disconnected'}
            </span>
            <span className="text-xs text-gray-500">
              ({healthData.database.responseTime}ms)
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Events</div>
          <div className="text-lg font-semibold dark:text-gray-200">
            {(healthData.analytics.dataCount.pageViews + 
              healthData.analytics.dataCount.articleViews + 
              healthData.analytics.dataCount.chapterViews + 
              healthData.analytics.dataCount.searchQueries).toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="text-sm text-gray-500 dark:text-gray-400">24h Sessions</div>
          <div className="text-lg font-semibold dark:text-gray-200">
            {healthData.analytics.recentActivity.sessionCount24h.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Page Views</div>
          <div className="font-medium dark:text-gray-200">{healthData.analytics.dataCount.pageViews.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Article Views</div>
          <div className="font-medium dark:text-gray-200">{healthData.analytics.dataCount.articleViews.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Searches</div>
          <div className="font-medium dark:text-gray-200">{healthData.analytics.dataCount.searchQueries.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Active Users</div>
          <div className="font-medium dark:text-gray-200">{healthData.analytics.dataCount.activeUsers.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Last Page View</div>
          <div className="font-medium dark:text-gray-200">
            {formatLastActivity(healthData.analytics.recentActivity.lastPageView)}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Last Search</div>
          <div className="font-medium dark:text-gray-200">
            {formatLastActivity(healthData.analytics.recentActivity.lastSearch)}
          </div>
        </div>
      </div>

      {healthData.issues.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Issues Detected:</div>
          <ul className="space-y-1">
            {healthData.issues.map((issue, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>Last checked: {formatTimestamp(healthData.timestamp)}</span>
          </div>
          <div>Response time: {healthData.performance.apiResponseTime}ms</div>
        </div>
      </div>
    </motion.div>
  );
}