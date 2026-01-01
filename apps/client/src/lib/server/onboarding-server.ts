import { apiFetch } from "@/lib/helpers/api-fetch";

// Onboarding API functions
export async function checkOnboarding(): Promise<{
  step: number;
  completed: boolean;
  started: boolean;
}> {
  return await apiFetch("/users/onboarding");
}
