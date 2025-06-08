FROM node:18.19-alpine AS deps

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package.json and prisma directory first
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Build stage
FROM node:18.19-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/prisma ./prisma

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create a simple .env file for the build
RUN echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shadownet" > .env
RUN echo "NEXTAUTH_URL=http://localhost:3000" >> .env
RUN echo "NEXTAUTH_SECRET=supersecretkey12345" >> .env

# Build Next.js directly without using the railway scripts
RUN npx next build

# Production stage
FROM node:18.19-alpine AS runner
WORKDIR /app

# Install OpenSSL for production
RUN apk add --no-cache openssl

# Set production environment
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start"]
