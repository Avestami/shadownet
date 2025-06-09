@echo off
echo ===================================
echo ShadowNet Database Setup
echo ===================================

echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please start Docker Desktop first.
    echo.
    echo 1. Search for "Docker Desktop" in your Start Menu
    echo 2. Start Docker Desktop and wait until it's running
    echo 3. Run this script again
    pause
    exit /b 1
)

echo Docker is running. Setting up database...
echo.

echo Creating environment files...
node setup-env.js
if %errorlevel% neq 0 (
    echo Failed to create environment files!
    pause
    exit /b 1
)

echo.
echo Starting PostgreSQL container...
docker-compose -f docker-compose.dev.yml up -d
if %errorlevel% neq 0 (
    echo Failed to start PostgreSQL container!
    pause
    exit /b 1
)

echo.
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client!
    pause
    exit /b 1
)

echo.
echo ===================================
echo Database setup completed successfully!
echo ===================================
echo.
echo You can now run "npm run dev" to start the application.
echo.
echo To stop the database: npm run db:docker:stop
echo To reset the database: npm run db:docker:reset
echo.
pause 