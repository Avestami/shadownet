const fs = require('fs');
const path = require('path');

// Define the environment variables
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

console.log('Environment setup complete!');
console.log('Run "docker-compose -f docker-compose.dev.yml up -d" to start the database'); 