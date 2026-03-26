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
  register: false,  // 临时禁用 PWA
  disable: true,    // 完全禁用
});

export default withPWAConfig(nextConfig);
