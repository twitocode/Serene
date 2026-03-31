import type React from "react";
import type { OnboardingState } from "@/lib/hooks/stores/onboarding-store";
import { IntermediateStepOne } from "./intermediate-step-1";
import { IntermediateStepTwo } from "./intermediate-step-2";
import { ReturningStep } from "./returning-step";
import { StepOne } from "./step-1";
import { StepTwo } from "./step-2";
import { StepThree } from "./step-3";
import { StepFour } from "./step-4";
import { StepFive } from "./step-5";
import { StepSix } from "./step-6";

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
		component: IntermediateStepOne,
		serverStep: 1,
		progress: 1,
	},
	{
		uiStep: 2,
		component: StepOne,
		serverStep: 1,
		progress: 1,
	},
	{
		uiStep: 3,
		component: IntermediateStepTwo,
		serverStep: 2,
		progress: 2,
		shouldSkip: (state) => !!state.initialName,
	},
	{
		uiStep: 4,
		component: StepTwo,
		serverStep: 2,
		progress: 2,
	},
	{
		uiStep: 5,
		component: StepThree,
		serverStep: 3,
		progress: 3,
	},
	{
		uiStep: 6,
		component: StepFour,
		serverStep: 4,
		progress: 4,
	},
	{
		uiStep: 7,
		component: StepFive,
		serverStep: 5,
		progress: 5,
	},
	{
		uiStep: 8,
		component: StepSix,
		serverStep: 6,
		progress: 6,
	},
];
