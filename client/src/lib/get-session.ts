import { apiFetch, ApiError } from "@/lib/helpers/api-fetch";
import { User } from "@/lib/types/index";

export async function getSession() {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");
    if (!token) {
      return null;
    }
  }

  try {
    const user = await apiFetch<User>(`/users/me`);
    return { user };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      return null;
    }

    console.error("Failed to get session:", error);
    return null;
  }
}
