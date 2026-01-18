import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@serene/shared"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
