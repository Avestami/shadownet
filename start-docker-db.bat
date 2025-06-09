@echo off
echo Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

echo Waiting for Docker to start (30 seconds)...
timeout /t 30

echo Setting up environment variables...
node setup-env.js

echo Starting PostgreSQL container...
docker-compose -f docker-compose.dev.yml up -d

echo Generating Prisma client...
npx prisma generate

echo Done! You can now run "npm run dev" to start the application.
pause 