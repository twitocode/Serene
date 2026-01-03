"use client";
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { useEffect } from "react";

export function ReturningStep() {
  const { goNext } = useOnboardingStore();
  useEffect(() => {
    const timer = setTimeout(() => {
      goNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, [goNext]);

  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-semibold">
        Hey! you haven't finished setting up your account
      </h1>
    </div>
  );
}
