// Simple caching mechanism to prevent excessive database calls
const userCache: Record<string, {
  data: any,
  timestamp: number
}> = {};

// Cache timeout (5 seconds)
const CACHE_TIMEOUT = 5000;

// Function to invalidate a user's cache when data is updated
export function invalidateUserCache(userId: string) {
  if (userCache[userId]) {
    delete userCache[userId];
  }
}

// Function to get cached user data
export function getCachedUser(userId: string) {
  const cached = userCache[userId];
  if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
    return cached.data;
  }
  return null;
}

// Function to cache user data
export function setCachedUser(userId: string, data: any) {
  userCache[userId] = {
    data,
    timestamp: Date.now()
  };
} 