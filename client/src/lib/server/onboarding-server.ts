import { serverFetch } from "@/lib/helpers/fetch-server";

// Onboarding API functions
export async function checkOnboarding(): Promise<{
  step: number;
  completed: boolean;
  started: boolean;
}> {
  try {
    const res = await serverFetch("/users/onboarding");
    if (!res.ok) {
      console.error("Server error:", res.status);
      throw new Error(`Server error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Check onboarding error:", error);
    return {
      step: -1,
      completed: false,
      started: false,
    };
  }
}
