const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const prisma = new PrismaClient();

/**
 * Initialize the database by running migrations and seeding
 */
async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  
  try {
    // Step 1: Check if we have access to the database
    console.log('Testing database connection...');
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('Database connection successful:', result);
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw new Error(`Database connection error: ${error.message}`);
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
            throw new Error('Could not initialize database schema');
          }
        }
      } else {
        console.error('Error checking database schema:', error.message);
        throw error;
      }
    }
    
    // Step 3: Check if seed data exists
    console.log('Checking if seed data exists...');
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