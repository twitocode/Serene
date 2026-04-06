import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function backendOrigin(): string {
	const base =
		process.env.INTERNAL_SERVER_URL?.replace(/\/$/, "") ||
		process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");
	return base ?? "";
}

const hopByHop = new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailers",
	"transfer-encoding",
	"upgrade",
	"content-encoding",
]);

/**
 * Proxies a GET to the ASP.NET API so the browser stays on the Next origin (cookies).
 * `apiPath` must start with `/` (e.g. `/signin-google`, `/auth/sign-in/google/callback`).
 */
export async function proxyApiGet(
	req: NextRequest,
	apiPath: string,
): Promise<NextResponse> {
	const origin = backendOrigin();
	if (!origin) {
		return NextResponse.json(
			{ error: "INTERNAL_SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set" },
			{ status: 500 },
		);
	}

	const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
	const url = new URL(req.url);
	const backendUrl = `${origin}${path}${url.search}`;

	let backendRes: Response;
	try {
		backendRes = await fetch(backendUrl, {
			method: "GET",
			redirect: "manual",
			headers: {
				cookie: req.headers.get("cookie") ?? "",
			},
			cache: "no-store",
		});
	} catch {
		return NextResponse.json(
			{ error: "Could not reach the API server" },
			{ status: 502 },
		);
	}

	const res = new NextResponse(backendRes.body, {
		status: backendRes.status,
		statusText: backendRes.statusText,
	});

	const setCookies =
		typeof backendRes.headers.getSetCookie === "function"
			? backendRes.headers.getSetCookie()
			: [];
	for (const c of setCookies) {
		res.headers.append("Set-Cookie", c);
	}
	if (setCookies.length === 0) {
		const single = backendRes.headers.get("Set-Cookie");
		if (single) {
			res.headers.append("Set-Cookie", single);
		}
	}

	backendRes.headers.forEach((value, key) => {
		const lower = key.toLowerCase();
		if (lower === "set-cookie") {
			return;
		}
		if (hopByHop.has(lower)) {
			return;
		}
		res.headers.set(key, value);
	});

	return res;
}
