import type { Cookies } from "@sveltejs/kit";
import * as setCookie from "set-cookie-parser";


export function setAuthTokens(cookies: Cookies, res: Response) {
	// In Node/SvelteKit, use .raw() to get all headers:
	const rawSetCookies = res.headers.getSetCookie();

	// Parse into map form
	const cookiesFromBackend = setCookie.parse(rawSetCookies, { map: true });
	if (cookiesFromBackend.ACCESS_TOKEN) {
		cookies.set("ACCESS_TOKEN", cookiesFromBackend.ACCESS_TOKEN.value, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "none",
			expires: cookiesFromBackend.ACCESS_TOKEN.expires
		});
	}

	if (cookiesFromBackend.REFRESH_TOKEN) {
		cookies.set("REFRESH_TOKEN", cookiesFromBackend.REFRESH_TOKEN.value, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "none",
			expires: cookiesFromBackend.REFRESH_TOKEN.expires
		});
	}

  return cookiesFromBackend.ACCESS_TOKEN.value ?? ""
}