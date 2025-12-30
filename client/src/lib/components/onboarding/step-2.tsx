import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { ChevronLeft } from "lucide-react";

export function StepTwo({
  age,
  setAge,
  gender,
  setGender,
  pronouns,
  setPronouns,
  onNext,
  onBack,
}: Pick<
  OnboardingStepProps,
  | "age"
  | "setAge"
  | "gender"
  | "setGender"
  | "pronouns"
  | "setPronouns"
  | "onNext"
  | "onBack"
>) {
  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
        <p className="text-gray-500 text-sm">
          This helps us personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="bg-gray-100 border-0"
          type="number"
        />

        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="bg-gray-100 border-0">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Pronouns (e.g., he/him, she/her, they/them)"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
          className="bg-gray-100 border-0"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-black hover:bg-gray-800 flex-1"
          disabled={!age || !gender}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
