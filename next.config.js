/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  // Disable font optimization to avoid Google Fonts issues
  optimizeFonts: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Add experimental features
  experimental: {
    // optimizeCss: true, // Disabled to fix critters module error
    webpackBuildWorker: true, // Enable webpack build worker
  },
  
  // Add webpack configuration
  webpack: (config, { isServer }) => {
    // Add fallback for font loading issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    
    return config
  },
  
  // Add headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
