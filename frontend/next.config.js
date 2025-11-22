const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '.')
    return config
  },
}

module.exports = nextConfig
