# Railway Deployment Guide

## Changes Made to Improve Flag Security

1. **Moved hardcoded flags to environment variables**:
   - Created a utility file `app/lib/flagConstants.ts` that loads flags from the `SHADOWNET_FLAGS` environment variable
   - Updated client-side code to use pattern matching instead of exact flag values
   - Modified the API route to validate flags against environment variables

2. **Environment Variable Setup**:
   - Successfully set the `SHADOWNET_FLAGS` environment variable in Railway

## Manual Deployment Steps

Since we're experiencing issues with the Railway CLI, you can complete the deployment manually:

1. **Log in to Railway Dashboard**:
   - Go to https://railway.app/dashboard
   - Select your project (thorough-bravery)

2. **Trigger a Deployment**:
   - In the project dashboard, find your service (shadownet)
   - Click "Deploy" or "Redeploy" button
   - This will pull the latest code from your GitHub repository

3. **Verify Environment Variables**:
   - In the service settings, check that the `SHADOWNET_FLAGS` environment variable is set correctly
   - The value should be: `SHADOWNET{DTHEREFORTH},SHADOWNET{SOUND876},SHADOWNET{S3CR3T_D34TH},SHADOWNET{M3M0RY_DUMP_1337},SHADOWNET{P4CK3T_W1Z4RD},SHADOWNET{FIRMWARE_BACKDOOR_X23},SHADOWNET{VULN_HUNTER_PRO},SHADOWNET{CRYPTO_BREAKER_9000},SHADOWNET{FINAL_ASCENSION},SHADOWNET{TOKEN_FORGED}`

4. **Test the Application**:
   - Once deployed, test the application to ensure flags are properly secured
   - Verify that the inspect element no longer shows the hardcoded flag values

## Security Improvements

With these changes, your application now:

1. No longer exposes flag values in client-side code
2. Uses server-side validation for flag submissions
3. Makes it easier to update flag values without changing code
4. Improves overall security posture

The flags are now only accessible on the server side through environment variables, making them much more secure against client-side inspection. 