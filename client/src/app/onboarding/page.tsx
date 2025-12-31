import { OnBoardingNavbar } from "@/lib/components/common/onboarding-navbar";
import { OnboardingFlow } from "@/lib/components/onboarding/onboarding-flow";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await getSession();
  const { step, completed, started } = await checkOnboarding();

  if (!session?.user) {
    redirect("/");
  }
  if (completed) {
    redirect("/home");
  }

  return (
    <div className=" mx-40 mt-5">
      <OnBoardingNavbar user={session.user} />
      <OnboardingFlow initialStep={step} hasStarted={started} />
    </div>
  );
}
