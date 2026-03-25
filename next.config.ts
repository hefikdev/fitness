import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Cache Components for dynamic auth/session routes.
  cacheComponents: false,
};

export default nextConfig;
