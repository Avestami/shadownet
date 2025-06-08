FROM node:18-alpine

# Install OpenSSL - this fixes the Prisma OpenSSL detection issue
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Set production environment
ENV NODE_ENV production

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
