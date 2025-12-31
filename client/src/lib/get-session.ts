import { serverFetch } from "@/lib/helpers/fetch-server";

export async function getSession() {
  try {
    const response = await serverFetch(`/auth/get-session`);

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
