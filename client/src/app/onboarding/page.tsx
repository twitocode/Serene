import { OnBoardingNavbar } from "@/lib/components/common/onboarding-navbar";
import { OnboardingFlow } from "@/lib/components/onboarding/onboarding-flow";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function page({ children, data }: PropsWithChildren<any>) {
  const session = await getSession();
  const { step, completed } = await checkOnboarding();

  if (!session?.user) {
    redirect("/login");
  }
  if (completed) {
    redirect("/home");
  }

  return (
    <div className=" mx-40 mt-5">
      <OnBoardingNavbar />
      <OnboardingFlow />
    </div>
  );
}
