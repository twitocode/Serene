import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema } from "$lib/components/auth/formSchema";
import type { ApiAppError } from "$lib/types";
import { AppErrors } from "$lib/types/application-errors";
import { redirect, type Actions } from "@sveltejs/kit";
import * as setCookie from "set-cookie-parser";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const form = await superValidate(zod4(loginSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${SERVER_URL}/auth/login`, {
			method: "POST",
			headers: [["Content-Type", "application/json"]],
			body: JSON.stringify({
				email: form.data.email,
				password: form.data.password
			})
		});

		if (!res.ok) {
			const errorResponse = (await res.json()) as ApiAppError;

			for (const error of errorResponse.errors) {
				if (error.code == AppErrors.UserNotFound) {
					setError(form, "email", error.message);
				} else if (error.code == AppErrors.AuthInvalidPassword) {
					setError(form, "password", error.message);
				}
			}

			return fail(404, { form });
		}

		const cookiesFromBackend = setCookie.parse(res.headers.get("set-cookie") ?? "", { map: true });

		if (cookiesFromBackend.ACCESS_TOKEN) {
			console.log("setting access_token");
			cookies.set("ACCESS_TOKEN", cookiesFromBackend.ACCESS_TOKEN.value, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "none",
				expires: cookiesFromBackend.ACCESS_TOKEN.expires
			});
		}

		if (cookiesFromBackend.REFRESH_TOKEN) {
			console.log("setting refresh_token");
			cookies.set("REFRESH_TOKEN", cookiesFromBackend.REFRESH_TOKEN.value, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "none",
				expires: cookiesFromBackend.REFRESH_TOKEN.expires
			});
		}

		console.log("Login successful, redirecting to callback");
		return redirect(308, "/home");
	}
};
