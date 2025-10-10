import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema, signUpSchema } from "@/lib/components/auth/formSchema";
import { setAuthTokens } from "@/lib/server/setAuthTokens";
import type { ApiAppError } from "@/lib/types";
import { AppErrors } from "@/lib/types/application-errors";
import { redirect } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load = async ({ cookies }) => {
	const access_token = cookies.get("ACCESS_TOKEN");
	if (access_token) {
		console.log("No access token found, redirecting to login");
		throw redirect(308, "/home");
	}

	//TODO: implement refresh token logic

	const form = await superValidate(zod4(signUpSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		let res = await fetch(`${SERVER_URL}/auth/register`, {
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
				if (error.code == AppErrors.UserAlreadyExists) {
					setError(form, "email", error.message);
				} else if (error.code == AppErrors.UserUpdateError) {
					setError(form, "email", error.message);
				}
			}

			return fail(404, { form });
		}

		res = await fetch(`${SERVER_URL}/auth/login`, {
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

		setAuthTokens(cookies, res);

		console.log("Register successful, redirecting to callback");
		return redirect(308, "/home");
	}
};
