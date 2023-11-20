const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `falsenotes.cdn.s3.ap-northeast-2.amazonaws.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `s3.ap-northeast-2.amazonaws.com`,
        port: '',
        pathname: `/falsenotes.cdn/**`,
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