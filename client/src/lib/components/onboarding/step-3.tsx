import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { ChevronLeft } from "lucide-react";

const countries = ["United States", "Canada"];

export function StepThree({
  country,
  setCountry,
  onNext,
  onBack,
}: Pick<OnboardingStepProps, "country" | "setCountry" | "onNext" | "onBack">) {
  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Where do you live?</h2>
        <p className="text-gray-500 text-sm">
          Select your country of residence
        </p>
      </div>

      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="bg-gray-100 border-0">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-black hover:bg-gray-800 flex-1"
          disabled={!country}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
