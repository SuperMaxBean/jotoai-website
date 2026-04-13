/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生成 trailing slash，对 SEO 更友好
  trailingSlash: false,

  // 自定义 headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;
