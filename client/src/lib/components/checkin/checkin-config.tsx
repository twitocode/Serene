import type React from "react";
import CheckinCompleteStep from "@/lib/components/checkin/checkin-complete-step";
import MoodStep from "@/lib/components/checkin/mood-step";
import ReframingStep from "@/lib/components/checkin/reframing-step";
import SomaticStep from "@/lib/components/checkin/somatic-step";
import WeighingStep from "@/lib/components/checkin/weighing-step";

export type StepConfig = {
	step: number;
	component: React.ComponentType;
};

export const CHECKIN_STEPS: StepConfig[] = [
	{ step: 0, component: MoodStep },
	{ step: 1, component: SomaticStep },
	{ step: 2, component: WeighingStep },
	{ step: 3, component: ReframingStep },
	{ step: 4, component: CheckinCompleteStep },
];
