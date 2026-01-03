"use client";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";

export function IntermediateStepOne() {
  const { goNext } = useOnboardingStore(state => state);
  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-semibold">
        We just have some quick questions for you
      </h1>
      <Button onClick={goNext} className="bg-black hover:bg-gray-800 px-8">
        Get Started
      </Button>
    </div>
  );
}
