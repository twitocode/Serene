import { apiFetch } from "@/lib/helpers/api-fetch";
import { Result } from "@/lib/types/api-types";
import { School } from "@/lib/types/index";


export async function completeOnboardingStep<T>(
  step: number,
  data: Record<string, unknown>
): Promise<Result<T>> {
  console.log(`trying to submit step ${step}`);

  return await apiFetch<T>(`/users/onboarding/step${step}`, {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function completeStep1(
  name: string
): Promise<Result<{ success: boolean }>> {
  return completeOnboardingStep<{ success: boolean }>(1, { name });
}

export async function completeStep2(
  dateOfBirth: string,
  gender: string,
  pronouns: string
): Promise<Result<{ success: boolean }>> {
  return completeOnboardingStep<{ success: boolean }>(2, { dateOfBirth, gender, pronouns });
}

export async function completeStep3(
  countryCode: string
): Promise<Result<{ success: boolean }>> {
  return completeOnboardingStep<{ success: boolean }>(3, { countryCode });
}

export async function completeStep4({
  name,
  city,
  countryCode,
  regionCode,
}: Omit<School, "id">): Promise<Result<{ success: boolean }>> {
  return completeOnboardingStep<{ success: boolean }>(4, {
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
): Promise<Result<{ success: boolean }>> {
  return completeOnboardingStep<{ success: boolean }>(5, {
    koalaName,
    koalaPronouns,
    koalaColour,
  });
}
