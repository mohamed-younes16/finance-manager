/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: "swiperjs.com" },
      { hostname: "utfs.io" },
      { hostname: "s3.amazonaws.com" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
