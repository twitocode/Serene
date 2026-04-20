import type React from "react";
import type { OnboardingState } from "@/lib/hooks/stores/onboarding-store";
import { IntermediateStepTwo } from "./intermediate-step-2";
import { ReturningStep } from "./returning-step";
import { StepOne } from "./step-1";
import { StepTwoCombined } from "./step-2-combined";
import { StepFour } from "./step-4";
import { StepFiveCombined } from "./step-5-combined";

export type StepConfig = {
	uiStep: number;
	component: React.ComponentType;
	serverStep: number;
	progress: number;
	shouldSkip?: (state: OnboardingState) => boolean;
};

export const ONBOARDING_STEPS: StepConfig[] = [
	{
		uiStep: 0,
		component: ReturningStep,
		serverStep: 0,
		progress: 1,
	},
	{
		uiStep: 1,
		component: StepOne,
		serverStep: 1,
		progress: 1,
	},
	{
		uiStep: 2,
		component: IntermediateStepTwo,
		serverStep: 2,
		progress: 2,
		shouldSkip: (state) => !!state.initialName,
	},
	{
		uiStep: 3,
		component: StepTwoCombined,
		serverStep: 2,
		progress: 2,
	},
	{
		uiStep: 4,
		component: StepFour,
		serverStep: 4,
		progress: 3,
	},
	{
		uiStep: 5,
		component: StepFiveCombined,
		serverStep: 5,
		progress: 4,
	},
];
