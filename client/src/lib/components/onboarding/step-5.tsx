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

const koalaColors = ["Gray", "Brown", "White", "Black", "Cream", "Tan"];

export function StepFive({
  koalaName,
  setKoalaName,
  koalaColor,
  setKoalaColor,
  koalaPronouns,
  setKoalaPronouns,
  onNext,
  onBack,
}: Pick<
  OnboardingStepProps,
  | "koalaName"
  | "setKoalaName"
  | "koalaColor"
  | "setKoalaColor"
  | "koalaPronouns"
  | "setKoalaPronouns"
  | "onNext"
  | "onBack"
>) {
  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Meet your koala companion! 🐨
        </h2>
        <p className="text-gray-500 text-sm">
          Let&apos;s personalize your koala friend
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Koala's name"
          value={koalaName}
          onChange={(e) => setKoalaName(e.target.value)}
          className="bg-gray-100 border-0"
        />

        <Select value={koalaColor} onValueChange={setKoalaColor}>
          <SelectTrigger className="bg-gray-100 border-0">
            <SelectValue placeholder="Select koala's color" />
          </SelectTrigger>
          <SelectContent>
            {koalaColors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Koala's pronouns"
          value={koalaPronouns}
          onChange={(e) => setKoalaPronouns(e.target.value)}
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
          disabled={!koalaName || !koalaColor}
        >
          Complete
        </Button>
      </div>
    </div>
  );
}
