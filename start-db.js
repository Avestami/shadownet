const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create environment files
console.log('Creating environment files...');
const envContent = `# Database URL for local Docker PostgreSQL container
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shadownet"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecretkey12345"

# Node environment
NODE_ENV="development"
`;

// Write to .env.local
fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
console.log('.env.local file created successfully');

// Also write to .env for Prisma
fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('.env file created successfully');

// Function to check if Docker is running
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Docker is running
if (!isDockerRunning()) {
  console.error('Docker is not running. Please start Docker Desktop and try again.');
  process.exit(1);
}

// Start PostgreSQL container
try {
  console.log('\nStarting PostgreSQL container...');
  execSync('docker-compose -f docker-compose.dev.yml up -d', { stdio: 'inherit' });
  console.log('PostgreSQL container started successfully.');
} catch (error) {
  console.error('Failed to start PostgreSQL container:', error.message);
  process.exit(1);
}

// Wait for PostgreSQL to be ready
console.log('\nWaiting for PostgreSQL to be ready...');
let ready = false;
let attempts = 0;
const maxAttempts = 30;

while (!ready && attempts < maxAttempts) {
  try {
    execSync('docker exec shadownet-postgres pg_isready -U postgres', { stdio: 'ignore' });
    ready = true;
  } catch (error) {
    attempts++;
    process.stdout.write(`Waiting for PostgreSQL to be ready... (${attempts}/${maxAttempts})\r`);
    // Wait 1 second
    execSync('timeout /t 1 /nobreak > nul', { shell: true });
  }
}

if (!ready) {
  console.error('\nPostgreSQL did not become ready in time.');
  process.exit(1);
}

console.log('\nPostgreSQL is ready!');

// Generate Prisma client
try {
  console.log('\nGenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully.');
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Try to run Prisma migrations
try {
  console.log('\nRunning Prisma migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Prisma migrations completed successfully.');
} catch (error) {
  console.log('Note: Migrations may not have run. This is normal for a first-time setup.');
}

console.log('\n✅ Database setup completed successfully!');
console.log('You can now run "npm run dev" to start the application.');
console.log('\nTo stop the database container, run: npm run db:docker:stop');
console.log('To reset the database, run: npm run db:docker:reset');

// Keep the console open
console.log('\nPress any key to exit...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0)); 