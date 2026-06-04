import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js"],
  outputFileTracingIncludes: {
    "/": [
      "./data/skillmarket.db",
      "./node_modules/sql.js/dist/sql-wasm.wasm"
    ],
    "/admin/**/*": [
      "./data/skillmarket.db",
      "./node_modules/sql.js/dist/sql-wasm.wasm"
    ],
    "/api/**/*": [
      "./data/skillmarket.db",
      "./node_modules/sql.js/dist/sql-wasm.wasm"
    ],
    "/marketplace/**/*": [
      "./data/skillmarket.db",
      "./node_modules/sql.js/dist/sql-wasm.wasm"
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    }
  }
};

export default nextConfig;
