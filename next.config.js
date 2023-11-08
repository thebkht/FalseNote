const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `falsenotescontent.s3.ap-northeast-2.amazonaws.com`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `s3.ap-northeast-2.amazonaws.com`,
        port: '',
        pathname: `/falsenotes.app/**`,
      },
      {
        protocol: 'https',
        hostname: `falsenotes.vercel.app`,
        port: '',
        pathname: `/**`,
      },
      {
        protocol: 'https',
        hostname: `avatars.githubusercontent.com`,
        port: '',
        pathname: `/**`,
      },

    ],
  },
  env: {
    DOMAIN: process.env.DOMAIN,
  }
};

module.exports = {
  ...nextConfig
};