import type { NextConfig } from "next";

const GA_ID = "G-C8L8TLDDD6";

const nextConfig: NextConfig = {
  transpilePackages: ["gsap"],
  serverExternalPackages: ["mongoose"],
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinaryLoader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Google Tag Gateway: proxy GA requests through /analytics so they
  // appear first-party and bypass ad blockers
  async rewrites() {
    return [
      {
        source: "/analytics/lib/:path*",
        destination: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}&l=dataLayer&cx=c`,
      },
      {
        source: "/analytics/script.js",
        destination: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
      },
      {
        source: "/analytics/:path*",
        destination: "https://www.google-analytics.com/:path*",
      },
    ];
  },
};

export default nextConfig;
