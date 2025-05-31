FROM node:20-alpine AS base

# Install dependencies required for canvas and Prisma
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev \
    openssl-dev \
    openssl1.1-compat

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Create a placeholder .env file with DATABASE_URL for Prisma
RUN echo "DATABASE_URL=\"postgresql://postgres:postgres@database:5432/project-control?schema=public\"" > .env
RUN echo "NEXTAUTH_URL=\"http://localhost:3000\"" >> .env
RUN echo "NEXTAUTH_SECRET=\"supersecretkey12345\"" >> .env

# Copy application code
COPY . .

# Build native modules and generate Prisma client
RUN npm rebuild canvas --update-binary
RUN npx prisma generate

# Add next.config.js output: 'standalone' if it doesn't exist
RUN if [ ! -f next.config.js ]; then echo "module.exports = { output: 'standalone' };" > next.config.js; fi
RUN if [ -f next.config.js ] && ! grep -q "output:" next.config.js; then sed -i 's/module.exports = {/module.exports = { output: "standalone",/g' next.config.js; fi

# Build Next.js
RUN npm run build

# Set production environment
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Expose port
EXPOSE 3000

# Create an entrypoint script to handle database connection and startup
RUN echo '#!/bin/sh' > /app/entrypoint.sh
RUN echo 'if [ -n "$DATABASE_URL" ]; then' >> /app/entrypoint.sh
RUN echo '  echo "DATABASE_URL=$DATABASE_URL" > .env' >> /app/entrypoint.sh
RUN echo 'fi' >> /app/entrypoint.sh
RUN echo 'if [ -n "$NEXTAUTH_URL" ]; then' >> /app/entrypoint.sh
RUN echo '  echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env' >> /app/entrypoint.sh
RUN echo 'fi' >> /app/entrypoint.sh
RUN echo 'if [ -n "$NEXTAUTH_SECRET" ]; then' >> /app/entrypoint.sh
RUN echo '  echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env' >> /app/entrypoint.sh
RUN echo 'fi' >> /app/entrypoint.sh
RUN echo 'exec npm start' >> /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Start the application
CMD ["/app/entrypoint.sh"]
