# Deployment Guide for Vercel

## Prerequisites

1. A PostgreSQL database (you can use Vercel Postgres, Supabase, or any other provider)
2. A Vercel account

## Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional
NODE_ENV="production"
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Add all the environment variables listed above

4. **Deploy**
   - Vercel will automatically deploy when you push to main
   - The build process now includes `prisma generate`

## Database Setup

If using Vercel Postgres:

1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Create a new Postgres database
4. Copy the connection string to `DATABASE_URL`

## Troubleshooting

- If you get Prisma errors, make sure `DATABASE_URL` is correctly set
- If NextAuth errors occur, verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- Check Vercel function logs for detailed error messages

## Build Process

The updated build process:
1. `prisma generate` - Generates Prisma client
2. `next build` - Builds the Next.js application

This ensures Prisma client is available during the build on Vercel. 