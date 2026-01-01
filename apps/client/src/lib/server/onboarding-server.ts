import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { redirect } from "next/navigation";

// Onboarding API functions
export async function checkOnboarding(): Promise<{
  step: number;
  completed: boolean;
  started: boolean;
}> {
  try {
    return await apiFetch("/users/onboarding");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
}
