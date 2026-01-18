import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@serene/shared"],
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") || "";
    if (!serverUrl) {
      console.warn("⚠️ NEXT_PUBLIC_SERVER_URL is not set. API rewrites will fail.");
    }
    const destination = `${serverUrl}/:path*`;
    console.log(`[next.config.ts] Rewriting /api/:path* to ${destination}`);
    return [
      {
        source: "/api/:path*",
        destination: destination,
      },
    ];
  },
};

export default nextConfig;
