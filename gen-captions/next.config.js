/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
    ],
    // 画像最適化の設定
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300, // 5分間キャッシュ
  },
  // 静的ファイルのキャッシュ設定
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800', // 1日キャッシュ、1週間SWR
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1年キャッシュ
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/generate",
      //   destination: "http://localhost:11434/api/generate",
      // },
    ];
  },
};

module.exports = nextConfig;
