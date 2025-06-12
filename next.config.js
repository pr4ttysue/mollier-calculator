/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    turbopack: true
  },
  async rewrites() {
    return []
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // Разрешаем подключения с любых IP адресов в локальной сети
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.0.105',
    '10.196.13.59',
    '172.20.10.4'
  ]
}

module.exports = nextConfig 