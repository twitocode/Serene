import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema } from "$lib/components/auth/formSchema";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { email } from "zod/v4";

export const load = async () => {
	const form = await superValidate(zod4(loginSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));
		console.log(form);

		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${SERVER_URL}/auth/login`, {
			method: "POST",
			headers: [["Content-Type", "application/json"]],
			body: JSON.stringify({
        email : form.data.email,
        password: form.data.password,
      })
		});

		if (!res.ok) {
			const errorResponse = await res.json();
			return fail(400, {
				form,
				errors: errorResponse.errors || [
					{ code: "unknown_error", message: "An unknown error occurred." }
				]
			});
		}

		type int = number;
		type float = number;
		type bool = boolean;
		type Error = {
			code: string;
			message: string;
		};

		const response = (await res.json()) as {
			type: string;
			title: string;
			statusCode: int;
			detail: string;
			instance: string;
			errors?: Error[];
			isSuccess: bool;
		};

		if (!response.isSuccess) {
			return fail(404, {
				errors: response.errors ?? []
			});
		}

		redirect(308, "/home");
	}
};
