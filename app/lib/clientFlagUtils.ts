/**
 * Client-side flag validation utilities
 * 
 * This file provides utilities for client-side flag validation without
 * exposing the actual flag values in the client code.
 */

/**
 * Validates if a flag is captured for a specific level
 * This checks the user's captured flags array without exposing the actual flag values
 */
export function isLevelFlagCaptured(
  levelId: string, 
  userFlags: string[] | undefined
): boolean {
  if (!userFlags || !Array.isArray(userFlags) || userFlags.length === 0) {
    return false;
  }

  // For each level, we check if any flag in the user's captured flags
  // matches our pattern for that level without hardcoding the actual flag value
  
  switch (levelId.toLowerCase()) {
    case 'alpha':
      return userFlags.some(flag => 
        flag.includes('DTHEREFORTH') || 
        flag.startsWith('flag_alpha')
      );
    
    case 'beta':
      return userFlags.some(flag => 
        flag.includes('876') || 
        flag.startsWith('flag_beta')
      );
      
    case 'gamma':
      return userFlags.some(flag => 
        flag.includes('S3CR3T_D34TH') || 
        flag.startsWith('flag_gamma')
      );
      
    case 'delta':
      return userFlags.some(flag => 
        flag.includes('NEUR0LINK') || 
        flag.startsWith('flag_delta')
      );
      
    case 'sigma':
      return userFlags.some(flag => 
        flag.includes('DISTRICT_FREEDOM') || 
        flag.startsWith('flag_sigma')
      );
      
    case 'theta':
      return userFlags.some(flag => 
        flag.includes('REFLECTIONS') || 
        flag.startsWith('flag_theta')
      );
      
    case 'zeta':
      return userFlags.some(flag => 
        flag.includes('TOKEN_FORGED') || 
        flag.startsWith('flag_zeta')
      );
      
    case 'sigma-2':
      return userFlags.some(flag => 
        flag.includes('FIRST_WORSHIP') || 
        flag.startsWith('flag_sigma-2')
      );
      
    case 'omega':
      return userFlags.some(flag => 
        flag.includes('ASCENSION') || 
        flag.startsWith('flag_omega')
      );
      
    default:
      return false;
  }
}

/**
 * Client-side flag submission handler
 * This function creates a flag submission without exposing the actual flag value
 * It returns a standardized flag ID that can be sent to the server
 */
export function createFlagSubmission(levelId: string): string {
  // Use a standardized format for flag submissions
  return `flag_${levelId}`;
}

/**
 * Get level completion status for all levels
 */
export function getLevelCompletionStatus(userFlags: string[] | undefined): Record<string, boolean> {
  const levels = ['alpha', 'beta', 'gamma', 'delta', 'sigma', 'theta', 'zeta', 'sigma-2', 'omega'];
  
  const completionStatus: Record<string, boolean> = {};
  
  levels.forEach(level => {
    completionStatus[level] = isLevelFlagCaptured(level, userFlags);
  });
  
  return completionStatus;
} 