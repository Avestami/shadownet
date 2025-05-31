const { PrismaClient } = require('@prisma/client');
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create Prisma client with more verbose error handling
const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
  errorFormat: 'pretty',
});

/**
 * Set environment variables for OpenSSL compatibility
 */
function setupOpenSSLEnv() {
  const libPaths = ['/usr/lib', '/usr/local/lib', '/lib'];
  const existingPaths = libPaths.filter(p => fs.existsSync(p));
  
  if (existingPaths.length > 0) {
    if (!process.env.LD_LIBRARY_PATH) {
      process.env.LD_LIBRARY_PATH = existingPaths.join(':');
    } else {
      const currentPaths = process.env.LD_LIBRARY_PATH.split(':');
      const newPaths = [...new Set([...currentPaths, ...existingPaths])];
      process.env.LD_LIBRARY_PATH = newPaths.join(':');
    }
    
    console.log(`Set LD_LIBRARY_PATH to ${process.env.LD_LIBRARY_PATH}`);
  }
}

/**
 * Initialize the database by running migrations and seeding
 */
async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  // Set up OpenSSL environment
  setupOpenSSLEnv();
  
  try {
    // Step 1: Check if we have access to the database
    console.log('Testing database connection...');
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('Database connection successful:', result);
    } catch (error) {
      console.error('Database connection failed:', error.message);
      
      // Try to diagnose the connection issue
      if (error.message.includes('libssl.so.1.1')) {
        console.error('OpenSSL 1.1 library not found. This is likely an environment issue.');
        console.log('Attempting to fix OpenSSL issue...');
        
        // Try creating symlinks
        try {
          if (fs.existsSync('/usr/lib/libssl.so.3') && !fs.existsSync('/usr/lib/libssl.so.1.1')) {
            execSync('ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1', { stdio: 'inherit' });
            execSync('ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1', { stdio: 'inherit' });
            console.log('Created OpenSSL symlinks. Retrying connection...');
            
            // Try connection again
            try {
              const retryResult = await prisma.$queryRaw`SELECT 1 as test`;
              console.log('Database connection successful after OpenSSL fix:', retryResult);
            } catch (retryError) {
              console.error('Still unable to connect after OpenSSL fix:', retryError.message);
              throw new Error(`Database connection error after OpenSSL fix: ${retryError.message}`);
            }
          } else {
            console.error('Could not find OpenSSL 3 libraries to create symlinks');
            throw new Error(`Database connection error: ${error.message}`);
          }
        } catch (symlinkError) {
          console.error('Failed to create OpenSSL symlinks:', symlinkError.message);
          throw new Error(`Database connection error: ${error.message}`);
        }
      } else if (error.message.includes('authentication')) {
        console.error('Database authentication failed. Check your DATABASE_URL credentials.');
        
        // Log the DATABASE_URL (masking the password)
        const dbUrl = process.env.DATABASE_URL || 'not set';
        console.log('Current DATABASE_URL:', dbUrl.replace(/:([^:@]+)@/, ':******@'));
        
        throw new Error(`Database authentication error: ${error.message}`);
      } else {
        throw new Error(`Database connection error: ${error.message}`);
      }
    }
    
    // Step 2: Check if tables exist
    console.log('Checking database schema...');
    try {
      // Try to query the User table as a test
      await prisma.user.findFirst();
      console.log('Database schema appears to be initialized.');
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('Database tables do not exist. Running migrations...');
        
        // Run Prisma migrations
        try {
          execSync('npx prisma migrate deploy', { stdio: 'inherit' });
          console.log('Migrations successfully applied.');
        } catch (migrationError) {
          console.error('Failed to run migrations:', migrationError.message);
          
          // Try direct schema push as a fallback
          console.log('Trying schema push as fallback...');
          try {
            execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
            console.log('Schema push successful.');
          } catch (pushError) {
            console.error('Failed to push schema:', pushError.message);
            
            // Last resort: try with spawn to capture more details
            console.log('Trying one last approach with direct schema push...');
            const result = spawnSync('npx', ['prisma', 'db', 'push', '--accept-data-loss'], {
              stdio: 'inherit',
              env: { ...process.env, PRISMA_CLIENT_ENGINE_TYPE: 'binary' }
            });
            
            if (result.status !== 0) {
              console.error('All schema initialization attempts failed');
              throw new Error('Could not initialize database schema');
            } else {
              console.log('Schema push successful with final attempt.');
            }
          }
        }
      } else {
        console.error('Error checking database schema:', error.message);
        throw error;
      }
    }
    
    // Step 3: Check if seed data exists
    console.log('Checking if seed data exists...');
    try {
      const userCount = await prisma.user.count();
      const levelCount = await prisma.level.count();
      
      if (userCount === 0 || levelCount === 0) {
        console.log('Seed data missing. Running database seed...');
        try {
          execSync('node prisma/seed.js', { stdio: 'inherit' });
          console.log('Database seeded successfully.');
        } catch (seedError) {
          console.error('Failed to seed database:', seedError.message);
          // Continue anyway, as this is not critical
        }
      } else {
        console.log(`Database contains data: ${userCount} users, ${levelCount} levels.`);
      }
    } catch (countError) {
      console.error('Error counting database records:', countError.message);
      // Not critical, continue
    }
    
    console.log('✅ Database initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { initializeDatabase };

// If run directly (not imported)
if (require.main === module) {
  initializeDatabase()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error('Unexpected error during database initialization:', err);
      process.exit(1);
    });
} 