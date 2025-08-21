import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies , locals }) => {
  return {
    user: locals.user
  }
};
