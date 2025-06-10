# Flag Security Implementation

## Overview

The capture flags have been moved from hardcoded values in the source code to environment variables. This enhances security by:

1. Preventing flags from being visible in client-side code or browser inspection
2. Allowing flag values to be changed without code modifications
3. Keeping sensitive data out of the source code repository

## Implementation Details

The implementation consists of:

1. A new utility file `app/lib/flagConstants.ts` that reads flags from environment variables
2. Updated API route `app/api/capture-flag/route.ts` that uses these utilities
3. Environment variable setup files that include the flag values

## Environment Variables

The flags are stored in the `SHADOWNET_FLAGS` environment variable as a comma-separated list:

```
SHADOWNET_FLAGS=SHADOWNET{DTHEREFORTH},SHADOWNET{SOUND876},...
```

## Updating Flags in Railway

To update the flags in the Railway deployment:

1. Log in to your Railway dashboard at https://railway.app
2. Select the ShadowNet project
3. Go to the "Variables" tab
4. Add or update the `SHADOWNET_FLAGS` variable with your comma-separated list of flags
5. Railway will automatically redeploy the application with the new environment variables

## Local Development

For local development, the flags are set in the `.env.local` and `.env` files, which are created by running:

```bash
node setup-env.js
```

## Security Considerations

- Keep in mind that while this approach is more secure than hardcoding values in the source code, the flags are still stored in environment variables on the server.
- Consider rotating flags periodically for high-security environments.
- For additional security, you could implement a hashing mechanism where only the hashed values of flags are stored and compared. 