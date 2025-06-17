import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enables App Router support
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
