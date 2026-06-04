import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js"],
  outputFileTracingIncludes: {
    "/": ["./data/skillmarket.db"],
    "/admin/**/*": ["./data/skillmarket.db"],
    "/api/**/*": ["./data/skillmarket.db"],
    "/marketplace/**/*": ["./data/skillmarket.db"]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

export default nextConfig;
