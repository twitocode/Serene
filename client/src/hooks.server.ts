import { SERVER_URL } from "$env/static/private";
import type { User } from "$lib/types";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";
import * as setCookie from "set-cookie-parser";

export const handle: Handle = async ({ event, resolve }) => {
	const ignoreRoutes = ["/login/callback"];

	if (ignoreRoutes.includes(event.url.pathname)) {
		return resolve(event);
	}
	const access_token = event.cookies.get("ACCESS_TOKEN");

	if (access_token) {
		const decodedToken = jwtDecode(access_token);

		if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
			console.log("access_token expired trying to get a new one");
			const refresh_token = event.cookies.get("REFRESH_TOKEN");

			if (!refresh_token) {
				event.locals.user = undefined;
				if (event.url.pathname !== "/login") {
					throw redirect(308, "/login");
				}
			}
			//refreshtoken
			const res = await event.fetch(`${SERVER_URL}/auth/refresh-token`, {
				method: "POST",
				headers: {
					Cookie: `REFRESH_TOKEN=${refresh_token}`
				}
			});

			if (!res.ok) {
				event.cookies.delete("ACCESS_TOKEN", { path: "/" });
				event.cookies.delete("REFRESH_TOKEN", { path: "/" });
				event.locals.user = undefined;

				if (event.url.pathname !== "/login") {
					throw redirect(308, "/login");
				}
			}

			const cookiesFromBackend = setCookie.parse(res.headers.get("set-cookie") ?? "", {
				map: true
			});

			if (cookiesFromBackend.ACCESS_TOKEN) {
				console.log("setting access_token");
				event.cookies.set("ACCESS_TOKEN", cookiesFromBackend.ACCESS_TOKEN.value, {
					path: "/",
					httpOnly: true,
					secure: true,
					sameSite: "none",
					expires: cookiesFromBackend.ACCESS_TOKEN.expires
				});

				event.locals.accessToken = cookiesFromBackend.ACCESS_TOKEN.value;
			}

			if (cookiesFromBackend.REFRESH_TOKEN) {
				console.log("setting refresh_token");
				event.cookies.set("REFRESH_TOKEN", cookiesFromBackend.REFRESH_TOKEN.value, {
					path: "/",
					httpOnly: true,
					secure: true,
					sameSite: "none",
					expires: cookiesFromBackend.REFRESH_TOKEN.expires
				});
			}
		}

		const res = await event.fetch(`${SERVER_URL}/users`, {
			method: "GET",
			headers: {
				Cookie: `ACCESS_TOKEN=${access_token}`
			}
		});

		if (!res.ok) {
      console.log(await res.json())
			event.cookies.delete("ACCESS_TOKEN", { path: "/" });
			event.cookies.delete("REFRESH_TOKEN", { path: "/" });
			event.locals.user = undefined;

			if (event.url.pathname !== "/login") {
				throw redirect(308, "/login");
			}

			event.locals.accessToken = access_token;
		}

		const data = await res.json();
		const user = data.value as User;
		event.locals.user = user;

		if (!user.isSetupCompleted && event.url.pathname !== "/setup-profile") {
      console.log("the users setup is not completed")
			throw redirect(308, "/setup-profile");
		}

	} else {
		event.locals.user = undefined;
		event.cookies.delete("ACCESS_TOKEN", { path: "/" });
		event.cookies.delete("REFRESH_TOKEN", { path: "/" });
	}

  	const response = await resolve(event);
		return response;
};
