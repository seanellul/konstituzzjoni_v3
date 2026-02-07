'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackActiveUser, getOrCreateSessionId } from '@/lib/analytics';
import { initActiveUsersTracking } from '@/lib/activeUsersStore';
import { isBrowser, getBaseUrl } from '@/lib/utils';

const ACTIVE_USER_INTERVAL = 3 * 60 * 1000; // 3 minutes

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

    // Initialize active users tracking and data store
    initActiveUsersTracking();

    // Register as active user immediately
    trackActiveUser();

    // Set up recurring active user pings with proper cleanup
    const activeUserInterval = setInterval(trackActiveUser, ACTIVE_USER_INTERVAL);

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

    // Cleanup on unmount
    return () => {
      clearInterval(activeUserInterval);
      window.fetch = originalFetch;
    };
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
