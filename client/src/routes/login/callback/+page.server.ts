import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, url, request, locals }) => {
	if (!cookies.get("ACCESS_TOKEN")) {
		console.log("No access token found, redirecting to login");
		throw redirect(302, "/login");
	}

	return redirect(302, "/home");
};
