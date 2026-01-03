"use client";
import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { Button } from "@/lib/components/ui/button";

export function IntermediateStepOne({
  onNext,
}: Pick<OnboardingStepProps, "onNext">) {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-semibold">
        We just have some quick questions for you
      </h1>
      <Button onClick={onNext} className="bg-black hover:bg-gray-800 px-8">
        Get Started
      </Button>
    </div>
  );
}
