import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@serene/shared"],
	async rewrites() {
		const serverUrl =
			process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ||
			process.env.INTERNAL_SERVER_URL?.replace(/\/$/, "") ||
			"";
		if (!serverUrl) {
			console.warn(
				"⚠️ NEXT_PUBLIC_SERVER_URL and INTERNAL_SERVER_URL are not set. API rewrites will fail.",
			);
		}
		const destination = `${serverUrl}/:path*`;
		console.log(`[next.config.ts] Rewriting /api/:path* to ${destination}`);
		return [
			{
				source: "/api/:path*",
				destination: destination,
			},
			// Google OAuth callback must hit the browser origin (Next), not the API port, so session cookies apply to the app.
			{
				source: "/signin-google",
				destination: `${serverUrl}/signin-google`,
			},
			// Older redirect_uri values used PathBase + CallbackPath (/auth + /signin-google). Proxy to the real callback.
			{
				source: "/auth/signin-google",
				destination: `${serverUrl}/signin-google`,
			},
		];
	},
};

export default nextConfig;
