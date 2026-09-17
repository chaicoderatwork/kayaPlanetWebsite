/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.iconscout.com" },
    ],
  },
  // Exclude heavy packages from serverless functions
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  async redirects() {
    return [
      { source: "/bridal", destination: "/", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "kayaplanet.com" }],
        destination: "https://www.kayaplanet.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
