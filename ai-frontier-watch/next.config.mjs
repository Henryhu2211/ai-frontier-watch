/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
}

export default nextConfig
