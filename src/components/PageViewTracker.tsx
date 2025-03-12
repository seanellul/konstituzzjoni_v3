'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackActiveUser, getOrCreateSessionId } from '@/lib/analytics';
import { initActiveUsersTracking } from '@/lib/activeUsersStore';
import { isBrowser, getBaseUrl } from '@/lib/utils';

export default function PageViewTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Skip on server-side
    if (!isBrowser()) return;
    
    console.log('PageViewTracker initialized');
    
    // Initialize session ID
    const sessionId = getOrCreateSessionId();
    console.log('Session ID:', sessionId);
    
    // Track page view for this specific page
    trackPageView(pathname);
    
    // Initialize active users tracking and data store - this sets up a single interval
    // instead of having multiple intervals in different components
    initActiveUsersTracking();
    
    // Register as active user (ping once, then the tracking will be maintained by setInterval)
    trackActiveUser();
    
    // Set up headers for future API requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // Only modify API requests to our own endpoints
      const inputUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : '';
      const isApiCall = inputUrl.includes('/api/');
      
      init = init || {};
      
      if (isApiCall) {
        init.headers = init.headers || {};
        
        // Add session ID header to all API requests
        init.headers = {
          ...init.headers,
          'x-session-id': sessionId
        };
      }
      
      // Add better error handling for fetch
      return originalFetch(input, init).catch(error => {
        console.error(`Fetch error for ${inputUrl}:`, error);
        throw error;
      });
    };
    
    // Restore original fetch when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [pathname]);
  
  // This component doesn't render anything
  return null;
} 