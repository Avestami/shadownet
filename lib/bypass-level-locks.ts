import { PrismaClient } from '@prisma/client';

// Define a list of all level IDs
export const ALL_LEVEL_IDS = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'sigma',
  'theta',
  'zeta',
  'sigma-2',
  'omega'
];

// This local flag allows bypassing level locks without touching the database
let bypassLevelLocks = true;

/**
 * Check if a level is unlocked for a user
 * This function will always return true if bypassLevelLocks is enabled
 */
export function isLevelUnlocked(levelId: string): boolean {
  // Always return true if bypass is enabled
  if (bypassLevelLocks) {
    return true;
  }
  
  // Otherwise, this would normally check the database
  return false;
}

/**
 * Enable bypassing level locks
 */
export function enableLevelBypass(): void {
  bypassLevelLocks = true;
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('SHADOWNET_BYPASS_LOCKS', 'true');
  }
}

/**
 * Disable bypassing level locks
 */
export function disableLevelBypass(): void {
  bypassLevelLocks = false;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('SHADOWNET_BYPASS_LOCKS');
  }
}

/**
 * Initialize the bypass status from localStorage
 */
export function initBypassStatus(): void {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem('SHADOWNET_BYPASS_LOCKS');
    bypassLevelLocks = storedValue === 'true';
  }
}

/**
 * Get current bypass status
 */
export function getBypassStatus(): boolean {
  return bypassLevelLocks;
} 