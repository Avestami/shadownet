/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  },
  // Disable static page generation for authenticated routes
  staticPageGenerationTimeout: 120,
  images: {
    unoptimized: true
  },
  swcMinify: false
}

module.exports = nextConfig 