/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
          domains: ["avatars.githubusercontent.com"],
        },
}

module.exports = {
     ...nextConfig,
     env: {
          GITHUB_ID: process.env.GITHUB_ID,
          GITHUB_ECRET: process.env.GITHUB_SECRET,
        },
}
