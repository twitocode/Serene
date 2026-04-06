import type { NextRequest } from "next/server";
import { proxyApiGet } from "@/lib/server/proxy-api-get";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
	return proxyApiGet(req, "/signin-google");
}
