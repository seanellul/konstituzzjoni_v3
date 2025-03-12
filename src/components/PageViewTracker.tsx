'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackActiveUser, getOrCreateSessionId } from '@/lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Initialize session ID
    const sessionId = getOrCreateSessionId();
    
    // Track page view
    trackPageView(pathname);
    
    // Register as active user
    trackActiveUser();
    
    // Set up headers for future API requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      init = init || {};
      init.headers = init.headers || {};
      
      // Add session ID header to all API requests
      init.headers = {
        ...init.headers,
        'x-session-id': sessionId
      };
      
      return originalFetch(input, init);
    };
    
    // Restore original fetch when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [pathname]);
  
  // This component doesn't render anything
  return null;
} 