// This file is used to help Prisma find the correct OpenSSL libraries
// It is invoked by the Prisma Node.js binding before loading the query engine

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Only run on Linux systems
if (os.platform() === 'linux') {
  console.log('[Prisma Runtime] Running on Linux, checking OpenSSL compatibility...');
  
  try {
    // Set environment variable for binary targets
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
    
    // Create library path if it doesn't exist
    const libraryPaths = [
      { path: '/usr/lib', exists: fs.existsSync('/usr/lib') },
      { path: '/usr/local/lib', exists: fs.existsSync('/usr/local/lib') },
      { path: '/lib', exists: fs.existsSync('/lib') }
    ];
    
    // Add all existing library paths to LD_LIBRARY_PATH
    const existingPaths = libraryPaths.filter(p => p.exists).map(p => p.path);
    
    if (existingPaths.length > 0) {
      if (!process.env.LD_LIBRARY_PATH) {
        process.env.LD_LIBRARY_PATH = existingPaths.join(':');
      } else if (!existingPaths.every(p => process.env.LD_LIBRARY_PATH.includes(p))) {
        process.env.LD_LIBRARY_PATH = `${process.env.LD_LIBRARY_PATH}:${existingPaths.join(':')}`;
      }
      
      console.log(`[Prisma Runtime] LD_LIBRARY_PATH set to ${process.env.LD_LIBRARY_PATH}`);
    }
    
    // Simplified OpenSSL compatibility
    const sources = [
      { path: '/usr/lib/libssl.so', name: 'libssl.so' },
      { path: '/usr/lib/libssl.so.3', name: 'libssl.so.3' },
      { path: '/usr/lib/libcrypto.so', name: 'libcrypto.so' },
      { path: '/usr/lib/libcrypto.so.3', name: 'libcrypto.so.3' }
    ];
    
    const targets = [
      { path: '/usr/lib/libssl.so.1.1', name: 'libssl.so.1.1' },
      { path: '/usr/lib/libcrypto.so.1.1', name: 'libcrypto.so.1.1' }
    ];
    
    // Create symlinks if needed
    for (const target of targets) {
      if (!fs.existsSync(target.path)) {
        for (const source of sources) {
          if (fs.existsSync(source.path) && source.name.startsWith(target.name.split('.')[0])) {
            try {
              console.log(`[Prisma Runtime] Creating symlink ${target.path} -> ${source.path}`);
              execSync(`ln -sf ${source.path} ${target.path}`);
              console.log(`[Prisma Runtime] Created symlink successfully`);
              break;
            } catch (e) {
              console.warn(`[Prisma Runtime] Could not create symlink: ${e.message}`);
            }
          }
        }
      } else {
        console.log(`[Prisma Runtime] ${target.path} already exists`);
      }
    }
    
    console.log('[Prisma Runtime] OpenSSL compatibility setup completed');
  } catch (error) {
    console.warn(`[Prisma Runtime] Error in OpenSSL compatibility setup: ${error.message}`);
  }
}

// Export nothing - this file is only for its side effects
module.exports = {}; 