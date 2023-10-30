const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
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
      }

    ],
  },
};

module.exports = {
  ...nextConfig, 
  // cashe control
  async headers() {
    //set to no store a cache on /feed and /feed?tag=* pages
    return [
      {
        source: '/feed',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
      {
        source: '/feed/:tag',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  }
};