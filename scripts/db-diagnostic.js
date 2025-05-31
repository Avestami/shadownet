#!/usr/bin/env node

/**
 * Database Connection Diagnostic Script
 * This script tests database connectivity and helps diagnose issues
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}====================================${colors.reset}`);
console.log(`${colors.cyan}Database Connection Diagnostic Tool${colors.reset}`);
console.log(`${colors.cyan}====================================${colors.reset}\n`);

// Load environment variables
let envFile = '.env';
if (fs.existsSync('.env.local')) {
  envFile = '.env.local';
} else if (fs.existsSync('.env.production')) {
  envFile = '.env.production';
}

if (fs.existsSync(envFile)) {
  console.log(`${colors.blue}Loading environment from ${envFile}${colors.reset}`);
  require('dotenv').config({ path: envFile });
} else {
  console.log(`${colors.yellow}No .env file found, using process environment${colors.reset}`);
}

// Check DATABASE_URL
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error(`${colors.red}ERROR: DATABASE_URL is not set in environment${colors.reset}`);
  console.log(`Please set a DATABASE_URL environment variable in your Railway project.`);
  process.exit(1);
}

// Parse and validate DATABASE_URL
try {
  console.log(`${colors.blue}Checking DATABASE_URL format...${colors.reset}`);
  
  // Mask password for display
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`DATABASE_URL: ${maskedUrl}`);
  
  const parsedUrl = new URL(dbUrl);
  
  if (parsedUrl.protocol !== 'postgresql:') {
    console.error(`${colors.red}ERROR: DATABASE_URL protocol must be postgresql://${colors.reset}`);
    process.exit(1);
  }
  
  if (!parsedUrl.username) {
    console.log(`${colors.yellow}WARNING: No username in DATABASE_URL${colors.reset}`);
  }
  
  if (!parsedUrl.password) {
    console.log(`${colors.yellow}WARNING: No password in DATABASE_URL${colors.reset}`);
  }
  
  if (!parsedUrl.hostname) {
    console.error(`${colors.red}ERROR: No hostname in DATABASE_URL${colors.reset}`);
    process.exit(1);
  }
  
  if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
    console.error(`${colors.red}ERROR: No database name in DATABASE_URL${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ DATABASE_URL format is valid${colors.reset}`);
  
  console.log(`\nConnection details:`);
  console.log(`- Host: ${parsedUrl.hostname}`);
  console.log(`- Port: ${parsedUrl.port || '5432 (default)'}`);
  console.log(`- Database: ${parsedUrl.pathname.substring(1)}`);
  console.log(`- Username: ${parsedUrl.username}`);
  console.log(`- Password: ${'*'.repeat(parsedUrl.password?.length || 0)}\n`);
  
} catch (error) {
  console.error(`${colors.red}ERROR: Invalid DATABASE_URL format${colors.reset}`);
  console.error(error.message);
  process.exit(1);
}

// Test database connection
async function testConnection() {
  console.log(`${colors.blue}Testing database connection...${colors.reset}`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  
  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(`${colors.green}✓ Connected to database successfully${colors.reset}`);
    
    // Check for tables
    try {
      console.log(`${colors.blue}Checking for database tables...${colors.reset}`);
      
      // Get table names
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      if (tables.length === 0) {
        console.log(`${colors.yellow}WARNING: No tables found in database${colors.reset}`);
        console.log(`You may need to run migrations or push your schema:`);
        console.log(`  npx prisma migrate deploy`);
        console.log(`  npx prisma db push\n`);
      } else {
        console.log(`${colors.green}✓ Found ${tables.length} tables in database:${colors.reset}`);
        tables.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
        
        // Check for specific tables
        const requiredTables = ['User', 'Session', 'Level'];
        const missingTables = requiredTables.filter(
          table => !tables.some(t => t.table_name.toLowerCase() === table.toLowerCase())
        );
        
        if (missingTables.length > 0) {
          console.log(`\n${colors.yellow}WARNING: Missing required tables: ${missingTables.join(', ')}${colors.reset}`);
          console.log(`You may need to run migrations or push your schema.`);
        } else {
          console.log(`\n${colors.green}✓ All required tables exist${colors.reset}`);
        }
      }
    } catch (schemaError) {
      console.error(`${colors.red}ERROR: Failed to check tables${colors.reset}`);
      console.error(schemaError);
    }
    
  } catch (error) {
    console.error(`${colors.red}ERROR: Database connection failed${colors.reset}`);
    console.error(error);
    
    // Check for common error patterns
    if (error.message.includes('ECONNREFUSED')) {
      console.error(`\n${colors.yellow}This usually means:${colors.reset}`);
      console.error(`1. The database server is not running or not accessible`);
      console.error(`2. There may be a firewall blocking the connection`);
      console.error(`3. The hostname or port might be incorrect`);
    } else if (error.message.includes('password authentication failed')) {
      console.error(`\n${colors.yellow}This usually means:${colors.reset}`);
      console.error(`1. The username or password in your DATABASE_URL is incorrect`);
      console.error(`2. The user doesn't have permission to access the database`);
    } else if (error.message.includes('does not exist')) {
      console.error(`\n${colors.yellow}This usually means:${colors.reset}`);
      console.error(`1. The database name in your DATABASE_URL doesn't exist`);
      console.error(`2. You need to create the database first`);
    }
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
  
  return true;
}

// Run all diagnostics
async function runDiagnostics() {
  const connectionSuccess = await testConnection();
  
  if (connectionSuccess) {
    console.log(`\n${colors.green}=============================${colors.reset}`);
    console.log(`${colors.green}Database connection is working${colors.reset}`);
    console.log(`${colors.green}=============================${colors.reset}`);
  } else {
    console.log(`\n${colors.red}===============================${colors.reset}`);
    console.log(`${colors.red}Database connection has issues${colors.reset}`);
    console.log(`${colors.red}===============================${colors.reset}`);
    console.log(`\nRecommended steps:`);
    console.log(`1. Verify your DATABASE_URL environment variable in Railway`);
    console.log(`2. Make sure your PostgreSQL service is running`);
    console.log(`3. Check network connectivity between your app and database`);
    console.log(`4. Try creating a new database service in Railway`);
  }
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error(`${colors.red}Unexpected error during diagnostics:${colors.reset}`, error);
  process.exit(1);
}); 