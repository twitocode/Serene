import { serverFetch } from "@/lib/helpers/fetch";

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

export async function completeOnboardingStep(
  step: number,
  data: Record<string, unknown>
): Promise<{ success: boolean }> {
  const res = await serverFetch(`/users/onboarding/step${step}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function goToStepTwo(name: string): Promise<{ success: boolean }> {
  return completeOnboardingStep(1, { name });
}

export async function goToStepThree(
  age: number,
  gender: string,
  pronouns: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(2, { age, gender, pronouns });
}

export async function goToStepFour(
  countryCode: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(3, { countryCode });
}

export async function goToLastStep(
  koalaName: string,
  koalaPronouns: string,
  koalaColour: string
): Promise<{ success: boolean }> {
  return completeOnboardingStep(4, {
    koalaName,
    koalaPronouns,
    koalaColour,
  });
}

export async function completeOnboarding(): Promise<{ success: boolean }> {
  const res = await serverFetch("/users/onboarding/complete", {
    method: "POST",
  });
  return res.json();
}
