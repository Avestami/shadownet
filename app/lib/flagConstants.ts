/**
 * Flag constants for the ShadowNet application
 * These are loaded from environment variables for security
 */

/**
 * Gets all available flags from environment variables
 * Falls back to empty array if not configured
 */
export function getAllFlags(): string[] {
  // Get flags from environment variable - expected format is comma-separated values
  const flagsEnv = process.env.SHADOWNET_FLAGS;
  
  if (!flagsEnv) {
    console.warn('SHADOWNET_FLAGS environment variable is not set');
    return [];
  }
  
  // Split the comma-separated values and trim each flag
  return flagsEnv.split(',').map(flag => flag.trim());
}

/**
 * Validates if a given flag is valid
 */
export function isValidFlag(flag: string): boolean {
  const allFlags = getAllFlags();
  return allFlags.includes(flag);
} 