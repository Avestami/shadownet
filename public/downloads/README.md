# ZETA Challenge - JWT Exploitation

This Docker container contains a vulnerable web application with JWT authentication flaws. The challenge is part of the ZETA level in the ShadowNet CTF.

## Quick Start

1. Extract the `zeta-docker.zip` file
2. Navigate to the extracted directory
3. Build and run the Docker container:

```bash
docker build -t zeta-app .
docker run -p 3000:3000 zeta-app
```

4. Access the application at [http://localhost:3000](http://localhost:3000)

## Challenge Overview

The ZETA challenge focuses on JWT (JSON Web Token) exploitation. Your mission is to:

1. Analyze the JWT implementation in the admin portal
2. Discover and exploit vulnerabilities in the token verification process
3. Forge a valid admin token to gain unauthorized access
4. Find and capture the hidden flag

## Technical Background

### JWT Structure

JWT tokens consist of three parts separated by dots:
- **Header**: Contains metadata about the token (algorithm, type)
- **Payload**: Contains claims (data)
- **Signature**: Ensures the token hasn't been tampered with

Example: `xxxxx.yyyyy.zzzzz`

### Common JWT Vulnerabilities

1. **Algorithm "none"**: Some JWT libraries accept tokens with the "none" algorithm, which doesn't use a signature
2. **Weak secret keys**: Predictable or weak secret keys can be brute-forced
3. **Algorithm confusion**: Switching from RS256 (asymmetric) to HS256 (symmetric)
4. **Missing signature verification**: Some implementations don't validate the signature

## Hints

- Look at the network requests when logging in
- Inspect the JWT token structure (try using [jwt.io](https://jwt.io))
- Check if you can modify the payload without invalidating the token
- The admin role might be controlled by a claim in the token

## Flag Format

The flag follows the format: `SHADOWNET{TOKEN_FORGED}`

Good luck, agent!

## Troubleshooting

- If Docker doesn't run, make sure Docker Desktop is installed and running
- If the container doesn't start, check for port conflicts on 3000
- If you can't access the application, verify the container is running with `docker ps` 