import { create, StateCreator } from 'zustand';

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

export const useActiveUsersStore = create<ActiveUsersState>(
  ((set, get) => ({
    count: 0,
    lastFetched: 0,
    isFetching: false,
    fetch: async () => {
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
        const res = await fetch('/api/analytics/active-users');
        
        if (!res.ok) {
          throw new Error('Failed to fetch active users');
        }
        
        const data = await res.json();
        set({ count: data.count, lastFetched: now, isFetching: false });
        return data.count;
      } catch (error) {
        console.error('Error fetching active users:', error);
        set({ isFetching: false });
        return count; // Return the previous count on error
      }
    }
  }) as StateCreator<ActiveUsersState>)
);

// Helper function to initialize the active user tracking
// This should be called once when the app loads
export function initActiveUsersTracking() {
  // Get the current time
  const now = Date.now();
  
  // Initialize the first fetch
  useActiveUsersStore.getState().fetch();
  
  // Set up recurring fetches every 60 seconds (reduced from 30)
  setInterval(() => {
    useActiveUsersStore.getState().fetch();
  }, 60 * 1000);
} 