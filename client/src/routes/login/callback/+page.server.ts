import { NODE_ENV, SERVER_URL } from "$env/static/private";
import { loginSchema } from "$lib/components/auth/formSchema";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies, url, request, locals }) => {
  //TODO: for some reason not sending back jwt but is sending back Identity.External
  console.log(request.headers)

  if (!cookies.get("ACCESS_TOKEN")) {
    console.log("No access token found, redirecting to login");
    throw redirect(302, "/login");
  }

  return redirect(302, "/home");
}