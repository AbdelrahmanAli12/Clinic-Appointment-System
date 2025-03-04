/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
