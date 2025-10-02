import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema } from "@/lib/components/auth/formSchema";
import { setAuthTokens } from "@/lib/server/setAuthTokens";
import type { ApiAppError } from "@/lib/types";
import { AppErrors } from "@/lib/types/application-errors";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals, fetch }) => {
	const form = await superValidate(zod4(loginSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
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

		setAuthTokens(cookies, res)

		console.log("Login successful, redirecting to callback");
		return redirect(308, "/home");
	}
};
