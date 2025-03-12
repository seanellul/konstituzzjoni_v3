/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/constitution',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 