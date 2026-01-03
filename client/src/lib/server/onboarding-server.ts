import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { OnboardingStatusDto } from "@/lib/types/api-types";
import { redirect } from "next/navigation";

// Onboarding API functions
export async function checkOnboarding(): Promise<OnboardingStatusDto> {
  const result = await apiFetch<OnboardingStatusDto>("/users/onboarding");

  if (!result.isSuccess) {
    if (
      result.errorCode?.includes("401") ||
      result.errorCode === "UNAUTHORIZED"
    ) {
      redirect("/login");
    }
    throw new ApiError(
      result.message || "Failed to check onboarding",
      500,
      result
    );
  }

  if (!result.data) {
    throw new Error("Onboarding data is missing");
  }

  return result.data;
}
