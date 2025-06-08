FROM node:18-alpine

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Set production environment
ENV NODE_ENV production

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 