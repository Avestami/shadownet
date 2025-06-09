const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting database setup...');

// Sleep function that works on both Windows and Unix
function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Step 1: Check if Docker is running
try {
  console.log('Checking if Docker is running...');
  execSync('docker info', { stdio: 'ignore' });
  console.log('Docker is running.');
} catch (error) {
  console.error('Docker is not running. Please start Docker and try again.');
  process.exit(1);
}

// Step 2: Start the PostgreSQL container
try {
  console.log('Starting PostgreSQL container...');
  execSync('docker-compose -f docker-compose.dev.yml up -d', { stdio: 'inherit' });
  console.log('PostgreSQL container started.');
} catch (error) {
  console.error('Failed to start PostgreSQL container:', error.message);
  process.exit(1);
}

// Step 3: Wait for PostgreSQL to be ready
console.log('Waiting for PostgreSQL to be ready...');
let ready = false;
let attempts = 0;
const maxAttempts = 30;

(async () => {
  while (!ready && attempts < maxAttempts) {
    try {
      execSync('docker exec shadownet-postgres pg_isready -U postgres', { stdio: 'ignore' });
      ready = true;
    } catch (error) {
      attempts++;
      console.log(`Waiting for PostgreSQL to be ready... (${attempts}/${maxAttempts})`);
      await sleep(1);
    }
  }

  if (!ready) {
    console.error('PostgreSQL did not become ready in time.');
    process.exit(1);
  }

  console.log('PostgreSQL is ready.');

  // Step 4: Run Prisma migrations
  try {
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Prisma migrations completed.');
  } catch (error) {
    console.error('Failed to run Prisma migrations:', error.message);
    process.exit(1);
  }

  // Step 5: Generate Prisma client
  try {
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated.');
  } catch (error) {
    console.error('Failed to generate Prisma client:', error.message);
    process.exit(1);
  }

  console.log('Database setup completed successfully!');
  console.log('You can now run "npm run dev" to start the application.');
})(); 