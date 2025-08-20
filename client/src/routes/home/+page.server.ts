import { SERVER_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { message } from "sveltekit-superforms";
import type { Result, User } from "$lib/types";
import type { Contrast } from "@lucide/svelte";

export const load: PageServerLoad = async ({ params, cookies, locals , fetch }) => {
  
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
		hasMoodCheckIn: item.value,
    //TODO: add a get user function
    user: locals.user
	};
};
