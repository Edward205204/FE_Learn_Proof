import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Backend (localhost:3000) đã tự convert ảnh sang WebP bằng Sharp.
    // Tắt Next.js image optimization để tránh lỗi SSRF "resolved to private ip"
    // khi đang phát triển với backend chạy trên localhost.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'cdn.worldvectorlogo.com',
        pathname: '/logos/**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net'
      },
      {
        protocol: 'https',
        hostname: 'svgl.app'
      },
      {
        protocol: 'https',
        hostname: 'skillicons.dev'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc'
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/media/**'
      }
    ]
  }
}

export default nextConfig
