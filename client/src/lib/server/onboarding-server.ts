import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { OnboardingStatusDto } from "@/lib/types/api-types";
import { redirect } from "next/navigation";

// Onboarding API functions
export async function checkOnboarding(): Promise<OnboardingStatusDto> {
  try {
    const response = await apiFetch<OnboardingStatusDto>("/users/onboarding");
    console.log(response);
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
}
