#!/usr/bin/env node

/**
 * Railway Entrypoint Script
 * This script handles OpenSSL compatibility and environment setup before starting the app
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🚂 Railway entrypoint script starting...');

// Set up symlinks for OpenSSL if needed
function setupOpenSSL() {
  console.log('Checking OpenSSL compatibility...');
  
  try {
    // Try to create the required symlinks
    const sources = [
      { path: '/usr/lib/libssl.so', name: 'libssl.so' },
      { path: '/usr/lib/libssl.so.3', name: 'libssl.so.3' },
      { path: '/usr/lib/libcrypto.so', name: 'libcrypto.so' },
      { path: '/usr/lib/libcrypto.so.3', name: 'libcrypto.so.3' }
    ];
    
    const targets = [
      { path: '/usr/lib/libssl.so.1.1', name: 'libssl.so.1.1' },
      { path: '/usr/lib/libcrypto.so.1.1', name: 'libcrypto.so.1.1' },
      { path: '/usr/local/lib/libssl.so.1.1', name: 'libssl.so.1.1' },
      { path: '/usr/local/lib/libcrypto.so.1.1', name: 'libcrypto.so.1.1' }
    ];
    
    // Create target directories if they don't exist
    ['/usr/lib', '/usr/local/lib'].forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creating directory ${dir}`);
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
          console.warn(`Could not create directory ${dir}: ${e.message}`);
        }
      }
    });
    
    // Try to create symlinks
    let symlinkCreated = false;
    for (const target of targets) {
      if (!fs.existsSync(target.path)) {
        for (const source of sources) {
          if (fs.existsSync(source.path) && source.name.startsWith(target.name.split('.')[0])) {
            try {
              console.log(`Creating symlink ${target.path} -> ${source.path}`);
              execSync(`ln -sf ${source.path} ${target.path}`);
              symlinkCreated = true;
              break;
            } catch (e) {
              console.warn(`Could not create symlink ${target.path}: ${e.message}`);
            }
          }
        }
      } else {
        console.log(`${target.path} already exists`);
        symlinkCreated = true;
      }
    }
    
    if (symlinkCreated) {
      console.log('✅ OpenSSL symlinks created successfully');
    } else {
      console.warn('⚠️ Could not create any OpenSSL symlinks');
    }
  } catch (error) {
    console.warn(`⚠️ Error setting up OpenSSL: ${error.message}`);
  }
}

// Set up environment variables
function setupEnvironment() {
  console.log('Setting up environment variables...');
  
  // Set LD_LIBRARY_PATH
  const libraryPaths = ['/usr/lib', '/usr/local/lib', '/lib'];
  const existingPaths = libraryPaths.filter(p => fs.existsSync(p));
  
  if (existingPaths.length > 0) {
    if (!process.env.LD_LIBRARY_PATH) {
      process.env.LD_LIBRARY_PATH = existingPaths.join(':');
    } else {
      const currentPaths = process.env.LD_LIBRARY_PATH.split(':');
      const newPaths = [...new Set([...currentPaths, ...existingPaths])];
      process.env.LD_LIBRARY_PATH = newPaths.join(':');
    }
    
    console.log(`LD_LIBRARY_PATH set to ${process.env.LD_LIBRARY_PATH}`);
  }
  
  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set. Application will not work.');
    console.log('Please set the DATABASE_URL environment variable in Railway dashboard.');
    process.exit(1);
  } else {
    console.log(`DATABASE_URL is set to: ${process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@')}`);
  }
  
  // Ensure PRISMA_CLIENT_ENGINE_TYPE is set to binary
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
  console.log(`PRISMA_CLIENT_ENGINE_TYPE set to: ${process.env.PRISMA_CLIENT_ENGINE_TYPE}`);
}

// Initialize the database
function initializeDatabase() {
  console.log('Initializing database...');
  try {
    // Run our dedicated db-init script
    execSync('node scripts/db-init.js', { stdio: 'inherit' });
    console.log('✅ Database initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

// Start the application
function startApp() {
  console.log('Starting application...');
  
  // Use the npm start command
  const nextStart = spawn('node', ['node_modules/.bin/next', 'start'], {
    stdio: 'inherit',
    env: process.env
  });
  
  // Handle process events
  nextStart.on('error', (err) => {
    console.error(`Failed to start application: ${err.message}`);
    process.exit(1);
  });
  
  nextStart.on('exit', (code) => {
    console.log(`Application exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle signals
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log(`Received ${signal}, shutting down...`);
      nextStart.kill(signal);
    });
  });
}

// Run setup steps
setupOpenSSL();
setupEnvironment();

// Run database initialization and start app
const dbInitialized = initializeDatabase();
if (dbInitialized) {
  console.log('Database initialization successful, starting application...');
  startApp();
} else {
  console.error('❌ Database initialization failed. Application may not function correctly.');
  console.log('Starting application anyway for debugging purposes...');
  startApp();
} 