import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // output: 'standalone',
  allowedDevOrigins: ["10.0.0.186"],
  turbopack: {
    root: process.cwd(),
  },

  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
