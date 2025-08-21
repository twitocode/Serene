import type { LayoutServerData } from "./$types";

export const load =  async ({locals}: any) => {
	return {
		user: locals.user
	};
};