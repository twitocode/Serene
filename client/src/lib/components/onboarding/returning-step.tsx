"use client";
import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { useEffect } from "react";

export function ReturningStep({ onNext }: Pick<OnboardingStepProps, "onNext">) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-semibold">
        Hey! you haven't finished setting up your account
      </h1>
    </div>
  );
}
