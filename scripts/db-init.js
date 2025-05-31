#!/usr/bin/env node

/**
 * Database Initialization Script
 * For Railway deployment - runs during build and startup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}====================================${colors.reset}`);
console.log(`${colors.cyan}Database Initialization Script${colors.reset}`);
console.log(`${colors.cyan}====================================${colors.reset}\n`);

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error(`${colors.red}ERROR: DATABASE_URL is not set in environment${colors.reset}`);
  console.error(`Please set a DATABASE_URL environment variable in your Railway project.`);
  process.exit(1);
}

// Create database schema if it doesn't exist
function initializeDatabase() {
  try {
    console.log(`${colors.blue}Checking Prisma client generation...${colors.reset}`);
    
    // Check if Prisma client is generated
    const nodeModulesPrismaClient = path.resolve('./node_modules/.prisma/client');
    if (!fs.existsSync(nodeModulesPrismaClient)) {
      console.log(`${colors.yellow}Prisma client not found, generating...${colors.reset}`);
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log(`${colors.green}✓ Prisma client generated${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ Prisma client already exists${colors.reset}`);
    }
    
    // Try to run migrations first (safest approach)
    console.log(`\n${colors.blue}Applying database migrations...${colors.reset}`);
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log(`${colors.green}✓ Migrations applied successfully${colors.reset}`);
    } catch (migrateError) {
      console.log(`${colors.yellow}Migration failed, falling back to direct schema push...${colors.reset}`);
      
      // If migrations fail, try direct schema push
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log(`${colors.green}✓ Schema pushed successfully${colors.reset}`);
      } catch (pushError) {
        console.error(`${colors.red}ERROR: Failed to push schema${colors.reset}`);
        console.error(pushError.toString());
        process.exit(1);
      }
    }
    
    // Check for seed data
    const prismaDir = path.resolve('./prisma');
    const seedFile = path.join(prismaDir, 'seed.ts');
    const seedFileJs = path.join(prismaDir, 'seed.js');
    
    if (fs.existsSync(seedFile) || fs.existsSync(seedFileJs)) {
      console.log(`\n${colors.blue}Seed file found, seeding database...${colors.reset}`);
      try {
        execSync('npx prisma db seed', { stdio: 'inherit' });
        console.log(`${colors.green}✓ Database seeded successfully${colors.reset}`);
      } catch (seedError) {
        console.log(`${colors.yellow}WARNING: Seeding failed, but continuing...${colors.reset}`);
        console.log(seedError.toString());
      }
    } else {
      console.log(`\n${colors.blue}No seed file found, skipping seeding${colors.reset}`);
    }
    
    console.log(`\n${colors.green}=============================${colors.reset}`);
    console.log(`${colors.green}Database initialization complete${colors.reset}`);
    console.log(`${colors.green}=============================${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}ERROR: Database initialization failed${colors.reset}`);
    console.error(error.toString());
    process.exit(1);
  }
}

// Run initialization
initializeDatabase(); 