# Railway Deployment Guide

This guide walks you through deploying this application on Railway.

## Prerequisites

- A Railway account
- Git repository with your application code
- PostgreSQL database setup in Railway

## Step 1: Configure Railway Variables

In your Railway project, set the following environment variables:

- `DATABASE_URL`: `postgresql://postgres:bXbWmMFKrKqabvxkeHExZOSmqaAqwxzH@postgres.railway.internal:5432/railway`
- `NEXTAUTH_URL`: Your application URL (e.g., `https://your-app-name.up.railway.app`)
- `NEXTAUTH_SECRET`: A secure random string for session encryption

## Step 2: Deploy to Railway

### Option 1: Deploy from GitHub

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect and deploy your app

### Option 2: Deploy using Railway CLI

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login to Railway: `railway login`
3. Link to your project: `railway link`
4. Deploy the app: `railway up`

## Step 3: Check Deployment Status

1. Monitor the deployment logs in Railway dashboard
2. Once deployed, your app will be available at your Railway URL
3. Visit `/api/health` to verify the application health status

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Verify your `DATABASE_URL` is correct
2. Check that your database service is running
3. Make sure you're using `postgres.railway.internal` for the hostname in the internal URL
4. Run `railway logs` to see application error logs

### OpenSSL Issues

If you see OpenSSL-related errors:

1. The application includes scripts to handle OpenSSL compatibility
2. Check if the symlinks were created successfully in the logs
3. Verify that the Prisma binary targets include the right platforms

### Application Health

To verify your application's health:

1. Visit `/api/health` on your deployed app
2. Check the database connection status
3. If there are issues, check the Railway logs for details

## Useful Commands

```bash
# Deploy app
railway up

# View logs
railway logs

# Connect to database
railway connect

# Link to existing project
railway link

# List variables
railway variables

# Add a variable
railway variables set KEY=VALUE
``` 