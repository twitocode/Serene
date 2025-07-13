import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { SERVER_URL, NODE_ENV } from "$env/static/private";
import { signUpSchema } from "$lib/components/auth/formSchema";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
	const form = await superValidate(zod4(signUpSchema));

	// Always return { form } in load functions
	return { form, SERVER_URL, IS_DEVELOPMENT: NODE_ENV == "development" };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(signUpSchema));
		console.log(form);

		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

    redirect(308, "/home");
	}
};
