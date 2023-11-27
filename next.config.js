const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `falsenotescontent.file.core.windows.net`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `falsenotescontent.blob.core.windows.net`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `falsenotes.netlify.app`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `avatars.githubusercontent.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `unsplash.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `images.unsplash.com`,
        port: '',
        pathname: `/**`,
      }
    ],
  },
  env: {
    DOMAIN: process.env.DOMAIN,
  }
};

module.exports = {
  ...nextConfig
};