import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { setupProfileSchema } from "$lib/components/auth/formSchema";
import type { ApiAppError, User, ValidationError } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const form = await superValidate(zod4(setupProfileSchema));
  
	return {
		user: locals.user,
		form,
		SERVER_URL,
		IS_DEVELOPMENT: NODE_ENV == "development"
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(setupProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${SERVER_URL}/users/setup`, {
			method: "POST",
			headers: {
        "Content-Type": "application/json" ,
        "Cookie": `ACCESS_TOKEN=${cookies.get("ACCESS_TOKEN")}`
      },
			body: JSON.stringify(form.data)
		});

		if (!res.ok) {
			const errorResponse = (await res.json()) as ValidationError<string>;
      console.log(errorResponse)
			return fail(404, { form });
		}

		console.log("Successfully setup user profile");
		return redirect(308, "/home");
	}
};
