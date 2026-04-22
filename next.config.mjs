import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true
})(nextConfig);
