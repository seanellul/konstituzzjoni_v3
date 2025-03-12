/**
 * Analytics Utilities for Konstituzzjoni.mt
 * 
 * These functions help track user interactions with the constitution,
 * collecting anonymized data on which chapters, articles, and terms
 * are most frequently accessed.
 */

// Function to track page views for general pages
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;
  
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
  console.log('trackSearch called with term:', term);
  
  if (typeof window === 'undefined') {
    console.log('trackSearch: window is undefined, returning early');
    return;
  }
  
  try {
    const sessionId = getOrCreateSessionId();
    console.log('trackSearch: fetching with sessionId:', sessionId);
    
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
    })
    .then(response => {
      console.log(`trackSearch: fetch response status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('trackSearch: response data:', data);
    })
    .catch(err => {
      console.error('trackSearch: fetch error:', err);
    });
  } catch (error) {
    console.error('Failed to track search:', error);
  }
}

// Generate a random session ID if one doesn't exist already
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-side';
  
  let sessionId = localStorage.getItem('constitution_session_id');
  
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('constitution_session_id', sessionId);
  }
  
  return sessionId;
}

// Function to track active users
export function trackActiveUser() {
  if (typeof window === 'undefined') return;
  
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
  
  // Re-ping every 2 minutes to maintain active status
  setTimeout(trackActiveUser, 2 * 60 * 1000);
} 