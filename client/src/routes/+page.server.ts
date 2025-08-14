import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
	const access_token = cookies.get("ACCESS_TOKEN");
	if (access_token) {
		console.log("No access token found, redirecting to login");
		throw redirect(308, "/home");
	}

	//TODO: implement refresh token logic
};
