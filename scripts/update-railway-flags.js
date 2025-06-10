/**
 * Script to help update flags in Railway
 * This script doesn't directly update Railway but provides the command to run
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if Railway CLI is installed
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('Railway CLI detected.');
} catch (error) {
  console.error('Railway CLI not found. Please install it first:');
  console.error('npm i -g @railway/cli');
  process.exit(1);
}

// Read the current flags from env.production
let flags = '';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', 'env.production'), 'utf8');
  const flagsMatch = envContent.match(/SHADOWNET_FLAGS=(.+)/);
  if (flagsMatch && flagsMatch[1]) {
    flags = flagsMatch[1];
    console.log('Current flags found in env.production:');
    console.log(flags);
  } else {
    console.warn('No flags found in env.production');
  }
} catch (error) {
  console.warn('Could not read env.production:', error.message);
}

console.log('\n=== Railway Flags Update Guide ===\n');
console.log('To update flags in Railway, run the following command:');
console.log('\nrailway variables set SHADOWNET_FLAGS="' + flags + '"\n');
console.log('This will update the environment variable in Railway and trigger a redeployment.');
console.log('\nAlternatively, you can update the flags through the Railway dashboard:');
console.log('1. Go to https://railway.app');
console.log('2. Select your ShadowNet project');
console.log('3. Go to the "Variables" tab');
console.log('4. Add or update the SHADOWNET_FLAGS variable');
console.log('\nRemember that Railway will automatically redeploy your application after updating variables.'); 