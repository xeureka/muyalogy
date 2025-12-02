import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint completely

  // Optional: Disable TypeScript checking during build (if needed)
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors.
    // Remove this if you want to enforce type checking
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
