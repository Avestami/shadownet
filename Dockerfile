FROM node:20-alpine AS base

# Install dependencies required for canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

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

# Start the application
CMD ["npm", "start"]
