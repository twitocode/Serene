import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

export function StepOne({
  name,
  setName,
  onNext,
}: Pick<OnboardingStepProps, "name" | "setName" | "onNext">) {
  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">What should we call you?</h2>
        <p className="text-gray-500 text-sm">This is your username</p>
      </div>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-100 border-0"
        autoFocus
      />
      <Button
        onClick={onNext}
        className="bg-black hover:bg-gray-800 w-full"
        disabled={!name}
      >
        Continue
      </Button>
    </div>
  );
}
