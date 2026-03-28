/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
}

export default nextConfig
