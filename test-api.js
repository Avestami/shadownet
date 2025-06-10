/**
 * Test script to simulate the API route for flag captures
 */

// Set the environment variable locally for testing
process.env.SHADOWNET_FLAGS = "SHADOWNET{DTHEREFORTH},SHADOWNET{SOUND876},SHADOWNET{S3CR3T_D34TH},SHADOWNET{M3M0RY_DUMP_1337},SHADOWNET{P4CK3T_W1Z4RD},SHADOWNET{FIRMWARE_BACKDOOR_X23},SHADOWNET{VULN_HUNTER_PRO},SHADOWNET{CRYPTO_BREAKER_9000},SHADOWNET{FINAL_ASCENSION},SHADOWNET{TOKEN_FORGED}";

// Simple implementation of flag constants module
const getAllFlags = () => {
  const flagsEnv = process.env.SHADOWNET_FLAGS;
  
  if (!flagsEnv) {
    console.warn('SHADOWNET_FLAGS environment variable is not set');
    return [];
  }
  
  return flagsEnv.split(',').map(flag => flag.trim());
};

const isValidFlag = (flag) => {
  const allFlags = getAllFlags();
  return allFlags.includes(flag);
};

// Map level IDs to flag patterns for testing
const levelToFlagPattern = {
  'alpha': 'DTHEREFORTH',
  'beta': 'SOUND876',
  'gamma': 'S3CR3T_D34TH',
  'delta': 'M3M0RY_DUMP_1337',
  'sigma': 'P4CK3T_W1Z4RD',
  'theta': 'FIRMWARE_BACKDOOR_X23',
  'zeta': 'VULN_HUNTER_PRO',
  'sigma-2': 'CRYPTO_BREAKER_9000',
  'omega': 'FINAL_ASCENSION'
};

// Simulate the API route
function simulateCaptureFlag(request) {
  console.log('[API] capture-flag route started');
  
  // Parse request body
  const { flagId, baseScore = 100 } = request;
  
  if (!flagId) {
    console.error('[API] No flag ID provided');
    return { error: 'No flag ID provided', status: 400 };
  }
  
  console.log('[API] Attempting to capture flag:', flagId);
  
  // Check if this is a new format flag (flag_levelname) or the actual flag value
  let validFlag = false;
  let flagToStore = flagId;
  
  // If it starts with flag_, it's using the new client-side format
  if (flagId.startsWith('flag_')) {
    // Extract the level ID from the flag format
    const levelId = flagId.substring(5); // Remove 'flag_' prefix
    
    // Get the actual flag value for this level from the environment variables
    const allFlags = getAllFlags();
    const pattern = levelToFlagPattern[levelId];
    
    if (pattern) {
      // Find a flag that contains the pattern for this level
      const matchingFlag = allFlags.find(flag => flag.includes(pattern));
      
      if (matchingFlag) {
        flagToStore = matchingFlag;
        validFlag = true;
        console.log(`[API] Mapped client flag ${flagId} to actual flag: ${flagToStore}`);
      }
    }
  } else {
    // It's the actual flag value, check if it's valid
    validFlag = isValidFlag(flagId);
    flagToStore = flagId;
  }
  
  if (!validFlag) {
    console.error('[API] Invalid flag:', flagId);
    return { error: 'Invalid flag', status: 400 };
  }
  
  // Simulate user data
  const user = {
    id: 'user123',
    flagsCaptured: ['SHADOWNET{SOUND876}'],
    score: 100
  };
  
  // Check if flag is already captured
  if (user.flagsCaptured.includes(flagToStore)) {
    console.log('[API] Flag already captured:', flagToStore);
    return {
      message: 'Flag already captured',
      score: user.score
    };
  }
  
  // Add the flag to the user's captured flags
  user.flagsCaptured.push(flagToStore);
  
  // Calculate new score
  const newScore = user.score + baseScore;
  user.score = newScore;
  
  console.log('[API] Flag captured successfully:', flagToStore);
  console.log('[API] New score:', newScore);
  
  return {
    message: 'Flag captured successfully',
    score: newScore
  };
}

// Test cases
console.log('Test Case 1: Capture with actual flag value');
const result1 = simulateCaptureFlag({ flagId: 'SHADOWNET{DTHEREFORTH}', baseScore: 100 });
console.log('Result:', result1);
console.log('\n------------------------------\n');

console.log('Test Case 2: Capture with client-side flag format');
const result2 = simulateCaptureFlag({ flagId: 'flag_alpha', baseScore: 100 });
console.log('Result:', result2);
console.log('\n------------------------------\n');

console.log('Test Case 3: Capture with invalid flag');
const result3 = simulateCaptureFlag({ flagId: 'SHADOWNET{INVALID_FLAG}', baseScore: 100 });
console.log('Result:', result3);
console.log('\n------------------------------\n');

console.log('Test Case 4: Capture with already captured flag');
const result4 = simulateCaptureFlag({ flagId: 'SHADOWNET{SOUND876}', baseScore: 100 });
console.log('Result:', result4);
console.log('\n------------------------------\n'); 