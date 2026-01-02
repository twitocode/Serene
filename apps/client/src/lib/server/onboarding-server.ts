import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { redirect } from "next/navigation";

// Onboarding API functions
export async function checkOnboarding(): Promise<{
  step: number;
  completed: boolean;
  started: boolean;
}> {
  try {
    const response = await apiFetch<{
      step: number;
      completed: boolean;
      started: boolean;
    }>("/users/onboarding");
    console.log(response);
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
}
