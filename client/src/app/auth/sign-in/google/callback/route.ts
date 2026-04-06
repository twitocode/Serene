import type { NextRequest } from "next/server";
import { proxyApiGet } from "@/lib/server/proxy-api-get";

export const dynamic = "force-dynamic";

/** ASP.NET redirects here after Google OAuth when PublicApplicationUrl is the Next origin. */
export function GET(req: NextRequest) {
	return proxyApiGet(req, "/auth/sign-in/google/callback");
}
