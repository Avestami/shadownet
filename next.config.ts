import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/cts',
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  output: 'standalone',
  // Disable static page generation for authenticated routes
  staticPageGenerationTimeout: 120,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
