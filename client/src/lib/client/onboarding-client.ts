import { clientFetch } from "@/lib/helpers/fetch-client";

export async function completeOnboardingStep(
  step: number,
  data: Record<string, unknown>
): Promise<{ success: boolean }> {
  const res = await clientFetch(`/users/onboarding/step${step}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
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
  schoolName,
  city,
  countryCode,
  regionCode,
}: {
  schoolName: string;
  city: string;
  countryCode: string;
  regionCode: string;
}): Promise<{ success: boolean }> {
  return completeOnboardingStep(4, {
    schoolName,
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

export async function completeOnboarding(): Promise<{ success: boolean }> {
  const res = await clientFetch("/users/onboarding/complete", {
    method: "POST",
  });
  return res.json();
}
