/**
 * Analytics Utilities for Konstituzzjoni.mt
 *
 * These functions help track user interactions with the constitution,
 * collecting anonymized data on which chapters, articles, and terms
 * are most frequently accessed.
 *
 * PRIVACY FEATURES:
 * - Session IDs are randomly generated and not tied to personal data
 * - Session IDs rotate regularly to prevent long-term tracking
 * - No personal data is collected (no IP addresses, names, etc.)
 * - All data is subject to automatic deletion after the retention period
 * - Inappropriate search terms are filtered from analytics
 */

import { shouldFilterFromAnalytics } from './content-filters';
import { isBrowser, getBaseUrl } from './utils';

// Check if analytics is enabled for this user
export function isAnalyticsEnabled(): boolean {
  if (!isBrowser()) return false;

  // Check if they've opted out (hidden functionality, not exposed in UI)
  const analyticsOptOut = localStorage.getItem('analytics_opt_out');
  return analyticsOptOut !== 'true';
}

// Allow users to opt out of analytics (hidden functionality, not exposed in UI)
export function setAnalyticsOptOut(optOut: boolean): void {
  if (!isBrowser()) return;

  if (optOut) {
    localStorage.setItem('analytics_opt_out', 'true');
  } else {
    localStorage.removeItem('analytics_opt_out');
  }
}

// Function to track page views for general pages
export function trackPageView(path: string) {
  if (!isBrowser()) return;
  if (!isAnalyticsEnabled()) return;

  try {
    const sessionId = getOrCreateSessionId();
    const baseUrl = getBaseUrl();

    console.log(`[Analytics] Tracking page view: ${path} (session: ${sessionId.substring(0, 8)}...)`);

    fetch(`${baseUrl}/api/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        path,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || null,
      })
    }).then(response => {
      if (!response.ok) {
        console.warn(`[Analytics] Page view tracking failed: ${response.status}`);
      }
    }).catch(error => {
      console.error('[Analytics] Page view tracking error:', error);
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// Function to track article views
export function trackArticleView(chapter: number, article: number) {
  if (!isBrowser()) return;
  if (!isAnalyticsEnabled()) return;

  try {
    const sessionId = getOrCreateSessionId();
    const baseUrl = getBaseUrl();
    fetch(`${baseUrl}/api/analytics/article-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        chapter,
        article,
        timestamp: new Date().toISOString(),
      })
    });
  } catch (error) {
    console.error('Failed to track article view:', error);
  }
}

// Function to track chapter views
export function trackChapterView(chapter: number) {
  if (!isBrowser()) return;
  if (!isAnalyticsEnabled()) return;

  try {
    const sessionId = getOrCreateSessionId();
    const baseUrl = getBaseUrl();
    fetch(`${baseUrl}/api/analytics/chapter-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        chapter,
        timestamp: new Date().toISOString(),
      })
    });
  } catch (error) {
    console.error('Failed to track chapter view:', error);
  }
}

// Function to track searches
export function trackSearch(term: string) {
  if (!isBrowser()) return;
  if (!isAnalyticsEnabled()) return;

  // Skip tracking of blacklisted search terms
  if (shouldFilterFromAnalytics(term)) {
    console.log('Search term filtered from analytics tracking');
    return;
  }

  try {
    const sessionId = getOrCreateSessionId();
    const baseUrl = getBaseUrl();
    fetch(`${baseUrl}/api/analytics/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        term,
        timestamp: new Date().toISOString(),
      })
    });
  } catch (error) {
    console.error('Failed to track search:', error);
  }
}

// Generate a random session ID if one doesn't exist already
// Added session rotation for privacy enhancement
export function getOrCreateSessionId(): string {
  if (!isBrowser()) return 'server-side';

  let sessionId = localStorage.getItem('constitution_session_id');
  const sessionCreated = localStorage.getItem('constitution_session_created');
  const now = Date.now();

  // Check if session needs rotation (24 hours by default)
  const SESSION_ROTATION_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (
    !sessionId ||
    !sessionCreated ||
    now - parseInt(sessionCreated) > SESSION_ROTATION_PERIOD
  ) {
    // Generate a new session ID
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('constitution_session_id', sessionId);
    localStorage.setItem('constitution_session_created', now.toString());
  }

  return sessionId;
}

// Function to track active users - single ping, interval managed by PageViewTracker
export function trackActiveUser() {
  if (!isBrowser()) return;

  const sessionId = getOrCreateSessionId();

  try {
    const baseUrl = getBaseUrl();
    fetch(`${baseUrl}/api/analytics/active-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        sessionId,
        timestamp: new Date().toISOString(),
      })
    }).catch(error => {
      console.error('Failed to track active user:', error);
    });
  } catch (error) {
    console.error('Failed to track active user:', error);
  }
}
