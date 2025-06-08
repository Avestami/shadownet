#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Railway custom build script...');

// Check if package-lock.json exists and remove it
const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  console.log('Removing existing package-lock.json...');
  fs.unlinkSync(packageLockPath);
}

// Install dependencies with legacy peer deps
console.log('Installing dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Generate Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Prisma client:', error);
  process.exit(1);
}

// Build the application
console.log('Building the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build application:', error);
  process.exit(1);
}

console.log('Build completed successfully!'); 