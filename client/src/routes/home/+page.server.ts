import { SERVER_URL } from "$env/static/private";
import type { Result } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies, locals, fetch }) => {
	const res = await fetch(`${SERVER_URL}/mood/check-in`, {
		method: "GET",
		headers: {
			Cookie: `ACCESS_TOKEN=${locals.accessToken}`
		}
	});

	if (!res.ok) {
		console.log(await res.json());
	}

	const item = (await res.json()) as Result<boolean>;

	return {
		hasMoodCheckIn: item.value
	};
};
