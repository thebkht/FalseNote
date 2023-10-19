const { edges } = require('slate');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `falsenotes.s3.ap-northeast-2.amazonaws.com`,
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
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.node = {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
      };
    }
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = {
  ...nextConfig, 
};