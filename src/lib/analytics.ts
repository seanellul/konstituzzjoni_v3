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
 * - Users can be blacklisted if needed for inappropriate use
 * - No personal data is collected (no IP addresses, names, etc.)
 * - All data is subject to automatic deletion after the retention period
 * - Inappropriate search terms are filtered from analytics
 */

import { shouldFilterFromAnalytics } from './content-filters';

// Internal blacklist check - for administrative use only
function isSessionBlacklisted(): boolean {
  if (typeof window === 'undefined') return false;
  
  const sessionId = localStorage.getItem('constitution_session_id');
  
  // Check if this session ID is in the server-side blacklist
  // This requires a network request, so we cache the result in localStorage
  if (sessionId) {
    const blacklistStatus = localStorage.getItem('blacklist_status');
    const blacklistChecked = localStorage.getItem('blacklist_checked');
    const now = Date.now();
    
    // Only check blacklist status once per hour
    if (!blacklistChecked || now - parseInt(blacklistChecked) > 60 * 60 * 1000) {
      // Async check - we'll use the cached value for this request
      fetch('/api/analytics/check-blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('blacklist_status', data.blacklisted ? 'true' : 'false');
        localStorage.setItem('blacklist_checked', now.toString());
      })
      .catch(() => {
        // On error, assume not blacklisted
        localStorage.setItem('blacklist_status', 'false');
        localStorage.setItem('blacklist_checked', now.toString());
      });
    }
    
    return blacklistStatus === 'true';
  }
  
  return false;
}

// Check if analytics is enabled for this user
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // First check if user is blacklisted
  if (isSessionBlacklisted()) return false;
  
  // Otherwise check if they've opted out (hidden functionality, not exposed in UI)
  const analyticsOptOut = localStorage.getItem('analytics_opt_out');
  return analyticsOptOut !== 'true';
}

// Allow users to opt out of analytics (hidden functionality, not exposed in UI)
export function setAnalyticsOptOut(optOut: boolean): void {
  if (typeof window === 'undefined') return;
  
  if (optOut) {
    localStorage.setItem('analytics_opt_out', 'true');
  } else {
    localStorage.removeItem('analytics_opt_out');
  }
}

// Function to track page views for general pages
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;
  
  try {
    const sessionId = getOrCreateSessionId();
    fetch('/api/analytics/pageview', {
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
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// Function to track article views
export function trackArticleView(chapter: number, article: number) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;
  
  try {
    const sessionId = getOrCreateSessionId();
    fetch('/api/analytics/article-view', {
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
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;
  
  try {
    const sessionId = getOrCreateSessionId();
    fetch('/api/analytics/chapter-view', {
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
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;
  
  // Skip tracking of blacklisted search terms
  if (shouldFilterFromAnalytics(term)) {
    console.log('Search term filtered from analytics tracking');
    return;
  }
  
  try {
    const sessionId = getOrCreateSessionId();
    fetch('/api/analytics/search', {
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
  if (typeof window === 'undefined') return 'server-side';
  
  let sessionId = localStorage.getItem('constitution_session_id');
  let sessionCreated = localStorage.getItem('constitution_session_created');
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

// Function to track active users
export function trackActiveUser() {
  if (typeof window === 'undefined') return;
  
  // Note: We still track active users even if they're blacklisted or opted out
  // This gives us accurate site usage stats while still respecting privacy for detailed analytics
  
  const sessionId = getOrCreateSessionId();
  
  try {
    fetch('/api/analytics/active-user', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({ 
        sessionId,
        timestamp: new Date().toISOString(),
      })
    });
  } catch (error) {
    console.error('Failed to track active user:', error);
  }
  
  // Increase re-ping interval from 2 minutes to 3 minutes
  // The active-users endpoint counts users active in the last 5 minutes,
  // so pinging every 3 minutes is still within that window
  setTimeout(trackActiveUser, 3 * 60 * 1000);
} 