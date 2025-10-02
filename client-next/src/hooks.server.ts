import { SERVER_URL } from "$env/static/private";
import { setAuthTokens } from "@/lib/server/setAuthTokens";
import type { User } from "@/lib/types";
import type { Handle, RequestEvent } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";

function reset(event: RequestEvent) {
	event.cookies.delete("ACCESS_TOKEN", { path: "/" });
	event.cookies.delete("REFRESH_TOKEN", { path: "/" });
	event.cookies.delete("Identity.External", { path: "/" });
	event.locals.user = undefined;
	event.locals.accessToken = undefined;
}

async function refreshAccessToken(event: RequestEvent): Promise<string | null> {
	const refresh_token = event.cookies.get("REFRESH_TOKEN");
	if (!refresh_token) {
		reset(event);
		return null;
	}

	const res = await event.fetch(`${SERVER_URL}/auth/refresh-token`, {
		method: "POST",
		credentials: "include",
		headers: {
			Cookie: `REFRESH_TOKEN=${refresh_token}`
		}
	});

	if (!res.ok) {
		reset(event);
		return null;
	}

	const accessToken = setAuthTokens(event.cookies, res);
	if (!accessToken) {
		reset(event);
		return null;
	}

	event.locals.accessToken = accessToken;
	return accessToken;
}

async function getAuthenticatedUser(event: RequestEvent, token: string): Promise<User | null> {
	const res = await event.fetch(`${SERVER_URL}/users`, {
		method: "GET",
		credentials: "include",
		headers: {
			Cookie: `ACCESS_TOKEN=${token}`
		}
	});

	if (!res.ok) {
		reset(event);
		return null;
	}

	const data = await res.json();
	return data.value as User;
}

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const publicRoutes = ["/", "/login", "/signup"];

	if (pathname === "/logout") {
		reset(event);
		throw redirect(308, "/");
	} else if (pathname === "/login/callback") {
		return await resolve(event);
	}

	// Public routes
	if (publicRoutes.includes(pathname)) {
		// If already authenticated, redirect away
		let token = event.cookies.get("ACCESS_TOKEN") ?? null;
		if (!token) token = await refreshAccessToken(event);

		if (token) {
			const user = await getAuthenticatedUser(event, token);
			if (user) {
				event.locals.user = user;
				if (!user.isSetupCompleted) {
					throw redirect(308, "/setup-profile");
				} else {
					throw redirect(308, "/home");
				}
			}
		}

		return await resolve(event);
	}

	// Protected routes (everything else)
	let token = event.cookies.get("ACCESS_TOKEN") ?? null;

	if (token) {
		try {
			const decoded = jwtDecode(token);
			if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
				console.log("Access token expired, trying refresh");
				token = await refreshAccessToken(event);
			} else {
				event.locals.accessToken = token;
			}
		} catch {
			token = await refreshAccessToken(event);
		}
	} else {
		token = await refreshAccessToken(event);
	}

	if (!token) {
		throw redirect(308, "/login");
	}

	const user = await getAuthenticatedUser(event, token);
	if (!user) {
		throw redirect(308, "/login");
	}

	event.locals.user = user;

	// Enforce setup profile redirect
	if (!user.isSetupCompleted && pathname !== "/setup-profile") {
		throw redirect(308, "/setup-profile");
	}
	if (user.isSetupCompleted && pathname === "/setup-profile") {
		throw redirect(308, "/home");
	}

	return await resolve(event);
};
