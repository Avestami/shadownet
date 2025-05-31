# Railway Database Connection Debugging Guide

## 1. Check Environment Variables

In your Railway dashboard:
1. Go to your project
2. Navigate to the "Variables" tab
3. Verify that you have the following variables set:
   - `DATABASE_URL` - This should be set to your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Used for encrypting session tokens
   - `NEXTAUTH_URL` - Should be set to your application URL

## 2. Verify Database URL Format

The `DATABASE_URL` should follow this format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Example:
```
postgresql://postgres:your_password@containers-us-west-123.railway.app:5432/railway
```

## 3. Create the Database

If you're starting from scratch, make sure to:
1. Add a PostgreSQL database to your project in Railway
2. Once created, Railway will automatically set the `DATABASE_URL` variable

## 4. Manual Database Setup Steps

If your database exists but tables aren't created:

1. Connect to your database using the Railway CLI:
```bash
railway connect
```

2. Run Prisma migrations manually:
```bash
npx prisma migrate deploy
```

3. Or push the schema directly:
```bash
npx prisma db push --accept-data-loss
```

## 5. Check for Network Issues

- Ensure that your database and application services are in the same Railway project
- Check if there are any network policies blocking connections

## 6. Check Logs for Specific Errors

Look for these common error patterns:
- "Error connecting to database" - Connection string issues
- "Authentication failed" - Wrong username/password
- "Database does not exist" - Database name issue
- "Relation does not exist" - Missing tables

## 7. Temporary Workaround

If all else fails, try:
1. Create a new PostgreSQL database in Railway
2. Get the new connection string and update your `DATABASE_URL` variable
3. Deploy your application again
4. Run migrations manually after deployment

## 8. Support Contact

If you continue experiencing issues, please contact Railway support with:
- Your project ID
- Error logs
- Steps you've taken so far 