import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["gsap"],
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
