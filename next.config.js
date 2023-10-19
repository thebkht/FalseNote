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
        webpack: (config, { webpack }) => {
          config.plugins.push(new webpack.IgnorePlugin({
              resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
          }))
  
          return config
      },
}

module.exports = {
     ...nextConfig
}
