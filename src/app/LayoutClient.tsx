'use client';

import { useEffect } from 'react';
import { performanceMonitor } from '@/lib/performance';
import { initServiceWorker } from '@/lib/sw-registration';

export default function LayoutClient() {
  useEffect(() => {
    console.log('[Layout] Performance monitoring active:', performanceMonitor.getSessionId());
    initServiceWorker();

    const logInitialPerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('[Performance] Page Load Metrics:', {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            totalPageLoad: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            ttfb: Math.round(navigation.responseStart - navigation.requestStart)
          });
        }
      }
    };

    if (document.readyState === 'complete') {
      logInitialPerformance();
    } else {
      window.addEventListener('load', logInitialPerformance);
    }

    return () => {
      window.removeEventListener('load', logInitialPerformance);
    };
  }, []);

  return null;
}
