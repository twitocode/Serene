import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema } from "$lib/components/auth/formSchema";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load = async () => {
  redirect(308, "/home");
}