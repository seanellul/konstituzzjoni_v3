import { create } from 'zustand';
import { isBrowser, getBaseUrl } from './utils';

/**
 * Global store for active users data to prevent duplicate API calls
 * Uses client-side caching with a 30-second minimum interval between fetches
 */
interface ActiveUsersState {
  count: number;
  lastFetched: number;
  isFetching: boolean;
  fetch: () => Promise<number>;
}

export const useActiveUsersStore = create<ActiveUsersState>((set, get) => ({
  count: 0,
  lastFetched: 0,
  isFetching: false,
  fetch: async () => {
    // Skip fetching on server-side
    if (!isBrowser()) {
      return 0;
    }
    
    const now = Date.now();
    const { lastFetched, isFetching, count } = get();
    
    // Use cached data if it's recent (less than 30 seconds old) and not currently fetching
    if (now - lastFetched < 30000 && !isFetching) {
      return count;
    }
    
    // Prevent multiple simultaneous requests
    if (isFetching) {
      return count;
    }
    
    try {
      set({ isFetching: true });
      console.log('Fetching active users...');
      
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/analytics/active-users`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch active users: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Active users response:', data);
      set({ count: data.count, lastFetched: now, isFetching: false });
      return data.count;
    } catch (error) {
      console.error('Error fetching active users:', error);
      set({ isFetching: false });
      return count; // Return the previous count on error
    }
  }
}));

// Helper function to initialize the active user tracking
// This should be called once when the app loads
export function initActiveUsersTracking() {
  // Skip initialization on server-side
  if (!isBrowser()) {
    return;
  }
  
  console.log('Initializing active users tracking...');
  
  // Initialize the first fetch
  useActiveUsersStore.getState().fetch().then(count => {
    console.log('Initial active users count:', count);
  });
  
  // Set up recurring fetches every 60 seconds
  setInterval(() => {
    console.log('Fetching active users (interval)...');
    useActiveUsersStore.getState().fetch();
  }, 60 * 1000);
} 