const fs = require('fs');
const path = require('path');

// Define the environment variables
const envContent = `# Database URL for Railway PostgreSQL
DATABASE_URL="postgresql://postgres:bXbWmMFKrKqabvxkeHExZOSmqaAqwxzH@postgres.railway.internal:5432/railway"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecretkey12345"

# Node environment
NODE_ENV="development"

# ShadowNet flags - comma separated list of valid flags
SHADOWNET_FLAGS="SHADOWNET{DTHEREFORTH},SHADOWNET{SOUND876},SHADOWNET{S3CR3T_D34TH},SHADOWNET{M3M0RY_DUMP_1337},SHADOWNET{P4CK3T_W1Z4RD},SHADOWNET{FIRMWARE_BACKDOOR_X23},SHADOWNET{VULN_HUNTER_PRO},SHADOWNET{CRYPTO_BREAKER_9000},SHADOWNET{FINAL_ASCENSION},SHADOWNET{TOKEN_FORGED}"
`;

// Write to .env.local
fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
console.log('.env.local file created successfully');

// Also write to .env for Prisma
fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('.env file created successfully');

console.log('Environment setup complete!');
console.log('Run "npx prisma generate" to generate the Prisma client');
console.log('Then run "npm run dev" to start the application'); 