'use client';

import './globals.css';
import { Inter, Merriweather } from 'next/font/google';
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PageViewTracker from '@/components/PageViewTracker';
import PrivacyNotice from '@/components/PrivacyNotice';
import { Analytics } from '@vercel/analytics/react';
import { performanceMonitor } from '@/lib/performance';
import { initServiceWorker } from '@/lib/sw-registration';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

const currentYear = new Date().getFullYear();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Performance monitoring is automatically initialized on import
    // Just log that it's active
    console.log('[Layout] Performance monitoring active:', performanceMonitor.getSessionId());
    
    // Initialize service worker registration
    initServiceWorker();
    
    // Log initial load performance
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
    
    // Log performance after page is fully loaded
    if (document.readyState === 'complete') {
      logInitialPerformance();
    } else {
      window.addEventListener('load', logInitialPerformance);
    }
    
    return () => {
      window.removeEventListener('load', logInitialPerformance);
    };
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        <title>Kostituzzjoni.mt - Interactive Constitution of Malta</title>
        <meta name="description" content="Explore the Constitution of Malta through an interactive, user-friendly interface with advanced search and navigation features." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BD0F1F" />
        <meta name="application-name" content="Constitution.mt" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Constitution.mt" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#BD0F1F" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Performance and SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        <link rel="canonical" href="https://constitution.mt" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Constitution of Malta - Interactive Edition" />
        <meta property="og:description" content="Explore Malta's constitution through an intuitive, modern interface that brings legal text to life." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://constitution.mt" />
        <meta property="og:image" content="https://constitution.mt/og-image.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Constitution.mt" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Constitution of Malta - Interactive Edition" />
        <meta name="twitter:description" content="Explore Malta's constitution through an intuitive, modern interface that brings legal text to life." />
        <meta name="twitter:image" content="https://constitution.mt/twitter-image.png" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <link rel="dns-prefetch" href="//vercel-analytics.com" />
      </head>
      <body className="bg-secondary-light dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-grow max-w-full overflow-x-hidden">
          {children}
        </main>
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 sm:py-6 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              © {currentYear} Kostituzzjoni.mt | An interactive reader for the Constitution of Malta
            </p>
          </div>
        </footer>
        <PageViewTracker />
        <PrivacyNotice />
        <Analytics />
      </body>
    </html>
  );
} 