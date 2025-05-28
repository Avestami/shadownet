import { User } from '@prisma/client'

interface UserCacheData {
  user: User | null;
  lastFetch: number;
}

const userCache = new Map<string, UserCacheData>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function getCachedUser(userId: string): User | null {
  const cached = userCache.get(userId);
  if (!cached) return null;
  
  if (Date.now() - cached.lastFetch > CACHE_TTL) {
    userCache.delete(userId);
    return null;
  }
  
  return cached.user;
}

export function setCachedUser(userId: string, user: User | null): void {
  userCache.set(userId, {
    user,
    lastFetch: Date.now()
  });
}

export function clearUserCache(userId: string): void {
  userCache.delete(userId);
}

export function invalidateUserCache(userId: string): void {
  clearUserCache(userId);
} 