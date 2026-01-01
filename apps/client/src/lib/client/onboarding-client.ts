import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { toast } from "sonner";

export async function completeOnboardingStep(
  step: number,
  data: Record<string, unknown>
): Promise<{ success: boolean }> {
  try {
    return await apiFetch<{ success: boolean }>(
      `/users/onboarding/step${step}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );
  } catch (error: unknown) {
    // 1. Must be 'unknown' or 'any'

    // 2. Handle Known API Errors (400, 401, 404, 500)
    if (error instanceof ApiError) {
      if (error.data?.code === "INVALID_STEP_ORDER") {
        throw error;
      }
      toast.error(error.message);
    } else {
      // 3. Handle Network/Unknown Errors (Offline, etc.)
      toast.error("Something went wrong. Please check your connection.");
    }
    throw error;
  }
}

export async function completeStep1(
  name: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(1, { name });
}

export async function completeStep2(
  age: number,
  gender: string,
  pronouns: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(2, { age, gender, pronouns });
}

export async function completeStep3(
  countryCode: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(3, { countryCode });
}

export async function completeStep4({
  name,
  city,
  countryCode,
  regionCode,
}: {
  name: string;
  city: string;
  countryCode: string;
  regionCode: string;
}): Promise<{ success: boolean }> {
  return completeOnboardingStep(4, {
    name,
    city,
    countryCode,
    regionCode,
  });
}

export async function completeStep5(
  koalaName: string,
  koalaPronouns: string,
  koalaColour: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(5, {
    koalaName,
    koalaPronouns,
    koalaColour,
  });
}
