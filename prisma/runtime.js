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
    
    // Check for OpenSSL libraries and create symlinks if needed
    const libsslPaths = [
      '/usr/lib/libssl.so',
      '/usr/lib/libssl.so.3',
      '/usr/lib/x86_64-linux-gnu/libssl.so',
      '/lib/libssl.so'
    ];
    
    const libcryptoPaths = [
      '/usr/lib/libcrypto.so',
      '/usr/lib/libcrypto.so.3',
      '/usr/lib/x86_64-linux-gnu/libcrypto.so',
      '/lib/libcrypto.so'
    ];
    
    // Try to create symlinks for libssl.so.1.1 if it doesn't exist
    if (!fs.existsSync('/usr/lib/libssl.so.1.1')) {
      for (const source of libsslPaths) {
        if (fs.existsSync(source)) {
          console.log(`[Prisma Runtime] Creating symlink for libssl.so.1.1 -> ${source}`);
          try {
            // Attempt symlink creation in different directories
            const targets = [
              '/usr/lib/libssl.so.1.1',
              '/usr/local/lib/libssl.so.1.1',
              '/lib/libssl.so.1.1'
            ];
            
            for (const target of targets) {
              try {
                const dir = path.dirname(target);
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }
                if (!fs.existsSync(target)) {
                  fs.symlinkSync(source, target);
                  console.log(`[Prisma Runtime] Created symlink ${target} -> ${source}`);
                  break;
                }
              } catch (e) {
                console.warn(`[Prisma Runtime] Could not create symlink ${target}: ${e.message}`);
                // Try with execSync as a fallback
                try {
                  execSync(`ln -sf ${source} ${target}`);
                  console.log(`[Prisma Runtime] Created symlink with execSync: ${target} -> ${source}`);
                  break;
                } catch (e2) {
                  console.warn(`[Prisma Runtime] Could not create symlink with execSync: ${e2.message}`);
                }
              }
            }
            
            break;
          } catch (e) {
            console.warn(`[Prisma Runtime] Error creating symlink: ${e.message}`);
          }
        }
      }
    }
    
    // Repeat for libcrypto
    if (!fs.existsSync('/usr/lib/libcrypto.so.1.1')) {
      for (const source of libcryptoPaths) {
        if (fs.existsSync(source)) {
          console.log(`[Prisma Runtime] Creating symlink for libcrypto.so.1.1 -> ${source}`);
          try {
            // Attempt symlink creation in different directories
            const targets = [
              '/usr/lib/libcrypto.so.1.1',
              '/usr/local/lib/libcrypto.so.1.1',
              '/lib/libcrypto.so.1.1'
            ];
            
            for (const target of targets) {
              try {
                const dir = path.dirname(target);
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }
                if (!fs.existsSync(target)) {
                  fs.symlinkSync(source, target);
                  console.log(`[Prisma Runtime] Created symlink ${target} -> ${source}`);
                  break;
                }
              } catch (e) {
                console.warn(`[Prisma Runtime] Could not create symlink ${target}: ${e.message}`);
                // Try with execSync as a fallback
                try {
                  execSync(`ln -sf ${source} ${target}`);
                  console.log(`[Prisma Runtime] Created symlink with execSync: ${target} -> ${source}`);
                  break;
                } catch (e2) {
                  console.warn(`[Prisma Runtime] Could not create symlink with execSync: ${e2.message}`);
                }
              }
            }
            
            break;
          } catch (e) {
            console.warn(`[Prisma Runtime] Error creating symlink: ${e.message}`);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`[Prisma Runtime] Error checking OpenSSL compatibility: ${error.message}`);
  }
}

// Export nothing - this file is only for its side effects
module.exports = {}; 