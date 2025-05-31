# Deployment Guide

This document outlines how to deploy the application to Railway.

## Prerequisites

- A [Railway](https://railway.app/) account
- [Railway CLI](https://docs.railway.app/develop/cli) installed (optional)

## Environment Variables

The following environment variables are required for deployment:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: The public URL of your deployed application
- `NEXTAUTH_SECRET`: A secret for NextAuth session encryption

## Deployment Steps

### 1. Deploy with Railway Dashboard

1. Fork or clone this repository to your GitHub account
2. Connect your GitHub account to Railway
3. Create a new project in Railway from your GitHub repository
4. Add a PostgreSQL database service to your project
5. Configure the required environment variables
6. Deploy the application

### 2. Deploy with Railway CLI

```bash
# Login to Railway
railway login

# Link to your Railway project
railway link

# Add PostgreSQL service
railway add

# Set environment variables
railway variables set DATABASE_URL=...
railway variables set NEXTAUTH_URL=...
railway variables set NEXTAUTH_SECRET=...

# Deploy
railway up
```

## Troubleshooting

### OpenSSL Issues

If you encounter OpenSSL-related errors during deployment, the application includes configuration files to resolve these issues:

- `railway.toml`: Configures the Railway deployment
- `nixpacks.toml`: Specifies system dependencies including OpenSSL
- `scripts/deploy-setup.js`: Handles Prisma client generation

### Prisma Client Generation

The application is configured to generate the Prisma client during the build process. If you need to manually generate the client:

```bash
npm run prisma:generate
```

### Database Migration

To run database migrations on Railway:

```bash
railway run npx prisma migrate deploy
```

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment) 