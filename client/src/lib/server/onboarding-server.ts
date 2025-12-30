import { serverFetch } from "@/lib/helpers/fetch-server";

// Onboarding API functions
export async function checkOnboarding(): Promise<{
  step: number;
  completed: boolean;
}> {
  try {
    const res = await serverFetch("/users/onboarding");
    return await res.json();
  } catch (error) {
    console.error("Check onboarding error:", error);
    return {
      step: -1,
      completed: false,
    };
  }
}
