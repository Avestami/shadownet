FROM node:18-alpine AS deps

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package.json (no package-lock.json due to .dockerignore)
COPY package.json ./

# Install dependencies and generate fresh package-lock.json
RUN npm install --legacy-peer-deps

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Install OpenSSL for production
RUN apk add --no-cache openssl

# Set production environment
ENV NODE_ENV production

# Copy necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
