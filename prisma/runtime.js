// This file is used to help Prisma find the correct OpenSSL libraries
// It is invoked by the Prisma Node.js binding before loading the query engine

const fs = require('fs');
const path = require('path');
const os = require('os');

// Only run on Linux systems
if (os.platform() === 'linux') {
  console.log('[Prisma Runtime] Running on Linux, checking OpenSSL compatibility...');
  
  try {
    // Get paths
    const libsslPath = '/usr/lib/libssl.so.1.1';
    const libcryptoPath = '/usr/lib/libcrypto.so.1.1';
    
    // Check if symlinks need to be created
    if (!fs.existsSync(libsslPath) && fs.existsSync('/usr/lib/libssl.so.3')) {
      console.log('[Prisma Runtime] libssl.so.1.1 not found, but libssl.so.3 exists');
      
      // Set library path to include system libraries
      if (!process.env.LD_LIBRARY_PATH) {
        process.env.LD_LIBRARY_PATH = '/usr/lib';
      } else if (!process.env.LD_LIBRARY_PATH.includes('/usr/lib')) {
        process.env.LD_LIBRARY_PATH += ':/usr/lib';
      }
      
      console.log(`[Prisma Runtime] LD_LIBRARY_PATH set to ${process.env.LD_LIBRARY_PATH}`);
    }
  } catch (error) {
    console.warn(`[Prisma Runtime] Error checking OpenSSL compatibility: ${error.message}`);
  }
}

// Export nothing - this file is only for its side effects
module.exports = {}; 