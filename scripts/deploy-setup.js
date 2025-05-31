const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the OpenSSL libraries are properly linked
console.log('Setting up deployment environment...');

// Check for OpenSSL compatibility
try {
  console.log('Checking OpenSSL compatibility...');
  // Try to create symlinks if the libraries don't exist but newer versions do
  if (process.platform === 'linux') {
    const libsslPath = '/usr/lib/libssl.so.1.1';
    const libcryptoPath = '/usr/lib/libcrypto.so.1.1';
    
    if (!fs.existsSync(libsslPath) && fs.existsSync('/usr/lib/libssl.so.3')) {
      console.log('Creating symlink for libssl.so.1.1 -> libssl.so.3');
      execSync('ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 || true', { stdio: 'inherit' });
    }
    
    if (!fs.existsSync(libcryptoPath) && fs.existsSync('/usr/lib/libcrypto.so.3')) {
      console.log('Creating symlink for libcrypto.so.1.1 -> libcrypto.so.3');
      execSync('ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1 || true', { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.warn('⚠️ Could not create OpenSSL symlinks:', error.message);
}

// Set environment variables if not already set
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL environment variable not set. Using fallback value.');
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/project-control?schema=public';
}

if (!process.env.NEXTAUTH_URL) {
  console.warn('⚠️ NEXTAUTH_URL environment variable not set. Using fallback value.');
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET environment variable not set. Using fallback value.');
  process.env.NEXTAUTH_SECRET = 'supersecretkey12345';
}

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  const envContent = `DATABASE_URL="${process.env.DATABASE_URL}"
NEXTAUTH_URL="${process.env.NEXTAUTH_URL}"
NEXTAUTH_SECRET="${process.env.NEXTAUTH_SECRET}"
`;
  fs.writeFileSync(envPath, envContent);
}

// Modify the Prisma schema if needed
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (!schemaContent.includes('binaryTargets')) {
  console.log('Updating Prisma schema with binary targets...');
  const updatedSchema = schemaContent.replace(
    'generator client {',
    'generator client {\n  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]'
  );
  fs.writeFileSync(schemaPath, updatedSchema);
}

// Generate Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully.');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error);
  process.exit(1);
}

console.log('✅ Deployment setup completed successfully.'); 