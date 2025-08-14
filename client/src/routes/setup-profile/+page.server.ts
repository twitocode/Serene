import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema, setupProfileSchema } from "$lib/components/auth/formSchema";
import type { ApiAppError } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	const access_token = cookies.get("ACCESS_TOKEN");
	if (!access_token) {
		console.log("No access token found, redirecting to login");
		throw redirect(308, "/home");
	}

	//TODO: implement refresh token logic

	const form = await superValidate(zod4(loginSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(setupProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${SERVER_URL}/auth/login`, {
			method: "POST",
			headers: [["Content-Type", "application/json"]],
			body: JSON.stringify(form.data)
		});

		if (!res.ok) {
			const errorResponse = (await res.json()) as ApiAppError;
			return fail(404, { form });
		}

		console.log("Successfully setup user profile");
		return redirect(308, "/home");
	}
};
