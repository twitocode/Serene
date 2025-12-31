import { apiFetch } from "@/lib/helpers/api-fetch";

export async function getSession() {
  try {
    const response = await apiFetch(`/auth/get-session`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
