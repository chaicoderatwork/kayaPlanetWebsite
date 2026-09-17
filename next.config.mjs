/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
