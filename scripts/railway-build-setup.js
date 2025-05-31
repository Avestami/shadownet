#!/usr/bin/env node

/**
 * Railway Build Setup Script
 * This script prepares the environment for the build process on Railway
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚂 Railway build setup starting...');

// Ensure OpenSSL is available
function setupOpenSSL() {
  console.log('Setting up OpenSSL for build...');
  
  try {
    // Check if OpenSSL is installed
    const opensslVersion = execSync('openssl version', { encoding: 'utf-8' });
    console.log(`OpenSSL version: ${opensslVersion.trim()}`);
    
    // Check if libssl is available
    console.log('Checking for OpenSSL libraries...');
    const libsslPaths = [
      '/usr/lib/libssl.so',
      '/usr/lib/libssl.so.3',
      '/usr/lib/x86_64-linux-gnu/libssl.so',
      '/lib/libssl.so'
    ];
    
    const foundLibSSL = libsslPaths.some(path => {
      if (fs.existsSync(path)) {
        console.log(`Found libssl at: ${path}`);
        return true;
      }
      return false;
    });
    
    if (!foundLibSSL) {
      console.warn('⚠️ Could not find libssl. Prisma might not work correctly.');
    }
  } catch (error) {
    console.warn(`⚠️ Error checking OpenSSL: ${error.message}`);
  }
  
  // Set environment variables for OpenSSL
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
}

// Set up Prisma for the build
function setupPrisma() {
  console.log('Setting up Prisma for build...');
  
  try {
    // Update the schema if needed to handle OpenSSL issues
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    
    // Ensure we have the right binary targets
    if (!schemaContent.includes('binaryTargets')) {
      console.log('Adding binary targets to Prisma schema...');
      schemaContent = schemaContent.replace(
        'generator client {',
        'generator client {\n  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]'
      );
      fs.writeFileSync(schemaPath, schemaContent);
      console.log('Updated Prisma schema with binary targets');
    }
    
    // Add engineType = "binary" if not present
    if (!schemaContent.includes('engineType')) {
      console.log('Adding engine type to Prisma schema...');
      schemaContent = schemaContent.replace(
        'generator client {',
        'generator client {\n  engineType = "binary"'
      );
      fs.writeFileSync(schemaPath, schemaContent);
      console.log('Updated Prisma schema with engine type');
    }
    
    // Create a .env file if it doesn't exist
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.log('Creating .env file for Prisma...');
      const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:bXbWmMFKrKqabvxkeHExZOSmqaAqwxzH@postgres.railway.internal:5432/railway';
      const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'supersecretkey12345';
      
      const envContent = `DATABASE_URL="${dbUrl}"
NEXTAUTH_URL="${nextAuthUrl}"
NEXTAUTH_SECRET="${nextAuthSecret}"
`;
      fs.writeFileSync(envPath, envContent);
      console.log('Created .env file');
    }
  } catch (error) {
    console.error(`❌ Error setting up Prisma: ${error.message}`);
  }
}

// Main function
function main() {
  setupOpenSSL();
  setupPrisma();
  
  console.log('✅ Railway build setup completed');
}

// Run the script
main(); 