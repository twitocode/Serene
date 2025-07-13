import { SERVER_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { message } from "sveltekit-superforms";

export const load: PageServerLoad = async ({ params, cookies }) => {
	if (!cookies.get("ACCESS_TOKEN")) {
		return {
			status: 401,
			error: {
        message : "Unauthorized",
        code: "UNAUTHORIZED_ACCESS"
      }
		};
	}

	type int = number;
	type float = number;
	type bool = boolean;
	type Error = {
		code: string;
		message: string;
	};

	const res = await fetch(`${SERVER_URL}/mood/check-in`, {
		method: "GET",
		credentials: "include"
	});

  if (!res.ok) {
		redirect(308, "/");
	}

	const item = (await res.json()) as {
		type: string;
		title: string;
		statusCode: int;
		detail: string;
		instance: string;
		errors?: Error[];
		isSuccess: bool;
		value: string;
	};

	return {
		hasMoodCheckIn: item.value
	};
};
