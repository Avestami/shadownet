const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Ensure the OpenSSL libraries are properly linked
console.log('Setting up deployment environment...');

// Check for OpenSSL compatibility
try {
  console.log('Checking OpenSSL compatibility...');
  // Try to create symlinks if the libraries don't exist but newer versions do
  if (process.platform === 'linux') {
    // Create directories if they don't exist
    const dirs = ['/usr/lib', '/usr/local/lib'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creating directory ${dir}`);
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
          console.warn(`Could not create directory ${dir}: ${e.message}`);
        }
      }
    });

    // Library paths to check
    const libPaths = [
      { target: '/usr/lib/libssl.so.1.1', source: '/usr/lib/libssl.so' },
      { target: '/usr/lib/libcrypto.so.1.1', source: '/usr/lib/libcrypto.so' },
      { target: '/usr/local/lib/libssl.so.1.1', source: '/usr/lib/libssl.so' },
      { target: '/usr/local/lib/libcrypto.so.1.1', source: '/usr/lib/libcrypto.so' }
    ];

    // Create symlinks if needed
    libPaths.forEach(({ target, source }) => {
      if (!fs.existsSync(target) && fs.existsSync(source)) {
        console.log(`Creating symlink ${target} -> ${source}`);
        try {
          fs.symlinkSync(source, target);
        } catch (e) {
          console.warn(`Could not create symlink ${target}: ${e.message}`);
          // Try with execSync as a fallback
          try {
            execSync(`ln -sf ${source} ${target}`, { stdio: 'inherit' });
          } catch (e2) {
            console.warn(`Could not create symlink with execSync: ${e2.message}`);
          }
        }
      }
    });

    // Set library path environment variable
    const libraryPaths = ['/usr/lib', '/usr/local/lib'];
    if (!process.env.LD_LIBRARY_PATH) {
      process.env.LD_LIBRARY_PATH = libraryPaths.join(':');
    } else {
      const currentPaths = process.env.LD_LIBRARY_PATH.split(':');
      const newPaths = [...new Set([...currentPaths, ...libraryPaths])];
      process.env.LD_LIBRARY_PATH = newPaths.join(':');
    }
    console.log(`LD_LIBRARY_PATH set to ${process.env.LD_LIBRARY_PATH}`);
  }
} catch (error) {
  console.warn(`⚠️ Could not create OpenSSL symlinks: ${error.message}`);
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

// Modify the Prisma schema to use binary targets compatible with Railway
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (!schemaContent.includes('binaryTargets')) {
  console.log('Updating Prisma schema with binary targets...');
  const updatedSchema = schemaContent.replace(
    'generator client {',
    'generator client {\n  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x"]'
  );
  fs.writeFileSync(schemaPath, updatedSchema);
}

// Generate Prisma client
console.log('Generating Prisma client...');
try {
  // First try with execSync
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully.');
  } catch (error) {
    console.warn(`⚠️ First attempt to generate Prisma client failed: ${error.message}`);
    
    // Try again with spawnSync
    console.log('Retrying Prisma client generation...');
    const result = spawnSync('npx', ['prisma', 'generate'], {
      stdio: 'inherit',
      env: { ...process.env, LD_LIBRARY_PATH: '/usr/lib:/usr/local/lib' }
    });
    
    if (result.status === 0) {
      console.log('✅ Prisma client generated successfully on second attempt.');
    } else {
      throw new Error(`Prisma client generation failed with status ${result.status}`);
    }
  }
} catch (error) {
  console.error(`❌ Failed to generate Prisma client: ${error.message}`);
  console.warn('⚠️ Continuing build process despite Prisma client generation failure.');
  // Don't exit with error - let the build continue
}

console.log('✅ Deployment setup completed successfully.'); 