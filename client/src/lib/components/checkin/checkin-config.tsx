import CheckinCompleteStep from "@/lib/components/checkin/checkin-complete-step";
import LingeringStep from "@/lib/components/checkin/lingering-step";
import MoodStep from "@/lib/components/checkin/mood-step";
import PromptStep from "@/lib/components/checkin/prompt-step";
import SomaticStep from "@/lib/components/checkin/somatic-step";
import React from "react";


export type StepConfig = {
  step: number;
  component: React.ComponentType;
};

export const CHECKIN_STEPS: StepConfig[] = [
  {
    step: 0,
    component: MoodStep,
  },
  {
    step: 1,
    component: PromptStep,
  },
  {
    step: 2,
    component: SomaticStep,
  },
  {
    step: 3,
    component: LingeringStep,
  },
  {
    step: 4,
    component: CheckinCompleteStep,
  },
];
