import { SERVER_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { message } from "sveltekit-superforms";
import type { Result, User } from "$lib/types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const access_token = cookies.get("ACCESS_TOKEN");
	if (!access_token) {
		console.log("No access token found, redirecting to login");
		throw redirect(308, "/login");
	}
  
	let res = await fetch(`${SERVER_URL}/mood/check-in`, {
		method: "GET",
		headers: {
			Cookie: `ACCESS_TOKEN=${access_token}`
		}
	});
  
  if (!res.ok) {
    console.log(await res.json());
		redirect(308, "/");
	}
  
	const item = (await res.json()) as Result<boolean>;
  console.log("User is authorized");
  
  res = await fetch(`${SERVER_URL}/users/setup`, {
    method: "GET",
    headers: {
      Cookie: `ACCESS_TOKEN=${access_token}`
    }
  });

  const data = await res.json()
  const user = data.value as User

  if (!user.isSetupCompleted) {
    redirect(308, "/setup-profile");
  }
  
	return {
		hasMoodCheckIn: item.value,
    //TODO: add a get user function
    user
	};
};
