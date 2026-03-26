import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,   // ✅ 启用 PWA 注册
  disable: false,   // ✅ 不禁用
});

export default withPWAConfig(nextConfig);
