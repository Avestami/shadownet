/**
 * Test script to verify that our flag validation works correctly
 */

// Set the environment variable locally for testing
process.env.SHADOWNET_FLAGS = "SHADOWNET{DTHEREFORTH},SHADOWNET{SOUND876},SHADOWNET{S3CR3T_D34TH},SHADOWNET{M3M0RY_DUMP_1337},SHADOWNET{P4CK3T_W1Z4RD},SHADOWNET{FIRMWARE_BACKDOOR_X23},SHADOWNET{VULN_HUNTER_PRO},SHADOWNET{CRYPTO_BREAKER_9000},SHADOWNET{FINAL_ASCENSION},SHADOWNET{TOKEN_FORGED}";

// Let's create a simple implementation of the flag constants module for testing
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

// Test getting all flags
console.log('Testing getAllFlags():');
const flags = getAllFlags();
console.log(`Found ${flags.length} flags: ${flags.join(', ')}`);
console.log('');

// Test flag validation
console.log('Testing isValidFlag():');
const testFlags = [
  'SHADOWNET{DTHEREFORTH}',
  'SHADOWNET{SOUND876}',
  'SHADOWNET{INVALID_FLAG}',
  'NOT_A_FLAG'
];

testFlags.forEach(flag => {
  const isValid = isValidFlag(flag);
  console.log(`Flag "${flag}" is ${isValid ? 'valid' : 'invalid'}`);
});

// Test client-side validation pattern
console.log('\nTesting client-side pattern matching:');
function simulateClientSideCheck(flag, pattern) {
  return flag.includes(pattern);
}

const clientPatterns = {
  'alpha': 'DTHEREFORTH',
  'beta': '876',
  'gamma': 'S3CR3T_D34TH'
};

Object.entries(clientPatterns).forEach(([level, pattern]) => {
  const validFlag = flags.find(f => f.includes(pattern));
  const result = simulateClientSideCheck(validFlag, pattern);
  console.log(`Level ${level} pattern "${pattern}" matches flag: ${result}`);
});

console.log('\nAll tests completed!'); 