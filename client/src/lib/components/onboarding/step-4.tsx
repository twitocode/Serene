import { OnboardingStepProps } from "@/lib/components/onboarding/props";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { colleges, universities } from "@/lib/data";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function StepFour({
  school,
  setSchool,
  onNext,
  onBack,
}: Pick<
  OnboardingStepProps,
  "school" | "setSchool" | "onNext" | "onBack"
>) {
  const [activeTab, setActiveTab] = useState("universities");

  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">What school do you attend?</h2>
        <p className="text-gray-500 text-sm">
          Select your university or college
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
        </TabsList>

        <TabsContent value="universities" className="space-y-4">
          <Input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Type your university name..."
            className="bg-gray-100 border-0"
            list="universities-list"
          />
          <datalist id="universities-list">
            {universities.map((university) => (
              <option key={university.name} value={university.name} />
            ))}
          </datalist>
        </TabsContent>

        <TabsContent value="colleges" className="space-y-4">
          <Input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Type your college name..."
            className="bg-gray-100 border-0"
            list="colleges-list"
          />
          <datalist id="colleges-list">
            {colleges.map((college) => (
              <option key={college.name} value={college.name} />
            ))}
          </datalist>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-black hover:bg-gray-800 flex-1"
          disabled={!school}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
