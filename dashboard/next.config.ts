import type { NextConfig } from "next";

const API_TARGET =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
