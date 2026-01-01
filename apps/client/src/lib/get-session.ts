import { apiFetch } from "@/lib/helpers/api-fetch";
import { Session, User } from "better-auth";

export async function getSession() {
  try {
    const response = await apiFetch<{session: Session, user: User}>(`/auth/get-session`);
    return response
  } catch (error) {

    console.error("Failed to get session:", error);
    throw error;
  }
}
