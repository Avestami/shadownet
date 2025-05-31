FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Generate Prisma client
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

# Start the application
CMD ["npm", "start"]
