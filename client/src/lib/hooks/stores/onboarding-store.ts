import { createStore } from "zustand/vanilla";
import { ONBOARDING_STEPS } from "@/lib/components/onboarding/onboarding-config";

// 1. Define the props that might come from the Server (DB)
export interface OnboardingProps {
	initialStep?: number;
	initialHasStarted?: boolean;
	initialName?: string;
	initialDateOfBirth?: string;
	initialGender?: string;
	initialPronouns?: string;
	initialCountryCode?: string;
	initialSchool?: string;
	initialMochiName?: string;
	initialMochiPronouns?: string;
	initialStruggles?: string[];
}

export interface OnboardingState {
	// Current values
	name: string;
	dateOfBirth: string;
	gender: string;
	pronouns: string;
	countryCode: string;
	school: string;
	mochiName: string;
	mochiPronouns: string;
	struggles: string[];

	// Initial values from server (to check if already set)
	initialName: string;
	initialDateOfBirth: string;
	initialGender: string;
	initialPronouns: string;
	initialCountryCode: string;
	initialSchool: string;
	initialMochiName: string;
	initialMochiPronouns: string;
	initialStruggles: string[];

	// Flow Control
	step: number; // Server step
	uiStep: number; // Visual step
	hasStarted: boolean;
	direction: number;

	setName: (name: string) => void;
	setDateOfBirth: (dateOfBirth: string) => void;
	setGender: (gender: string) => void;
	setPronouns: (pronouns: string) => void;
	setCountryCode: (country: string) => void;
	setSchool: (school: string) => void;
	setMochiName: (name: string) => void;
	setMochiPronouns: (pronouns: string) => void;
	setStruggles: (struggles: string[]) => void;

	goNext: () => void;
	goBack: () => void;
	completeServerStep: () => void;
}

export type OnboardingStore = ReturnType<typeof createOnboardingStore>;

// 2. The Factory Function
export const createOnboardingStore = (initProps?: OnboardingProps) => {
	const initialStep = initProps?.initialStep || 1;
	const hasStarted = initProps?.initialHasStarted || false;
	const initialUiStep = hasStarted ? 0 : 1;

	return createStore<OnboardingState>((set, get) => ({
		// Current State (initialized with initial values)
		name: initProps?.initialName || "",
		dateOfBirth: initProps?.initialDateOfBirth || "",
		gender: initProps?.initialGender || "",
		pronouns: initProps?.initialPronouns || "",
		countryCode: initProps?.initialCountryCode || "",
		school: initProps?.initialSchool || "",
		mochiName: initProps?.initialMochiName || "",
		mochiPronouns: initProps?.initialMochiPronouns || "",
		struggles: initProps?.initialStruggles || [],

		// Initial State (preserved for comparison)
		initialName: initProps?.initialName || "",
		initialDateOfBirth: initProps?.initialDateOfBirth || "",
		initialGender: initProps?.initialGender || "",
		initialPronouns: initProps?.initialPronouns || "",
		initialCountryCode: initProps?.initialCountryCode || "",
		initialSchool: initProps?.initialSchool || "",
		initialMochiName: initProps?.initialMochiName || "",
		initialMochiPronouns: initProps?.initialMochiPronouns || "",
		initialStruggles: initProps?.initialStruggles || [],

		direction: 0,
		step: initialStep,
		uiStep: initialUiStep,
		hasStarted,

		// Actions
		setName: (name) => set({ name }),
		setDateOfBirth: (dateOfBirth) => set({ dateOfBirth }),
		setGender: (gender) => set({ gender }),
		setPronouns: (pronouns) => set({ pronouns }),
		setCountryCode: (countryCode) => set({ countryCode }),
		setSchool: (school) => set({ school }),
		setMochiName: (mochiName) => set({ mochiName }),
		setMochiPronouns: (mochiPronouns) => set({ mochiPronouns }),
		setStruggles: (struggles) => set({ struggles }),

		goNext: () => {
			const { step, uiStep } = get();
			const currentState = get();
			set({ direction: 1 });

			if (uiStep === 0) {
				// Find the first step that matches current server step and doesn't skip
				const nextStep = ONBOARDING_STEPS.find(
					(s) => s.serverStep === step && !s.shouldSkip?.(currentState),
				);
				if (nextStep) {
					set({ uiStep: nextStep.uiStep });
				}
				return;
			}

			// Find current step index
			const currentIndex = ONBOARDING_STEPS.findIndex(
				(s) => s.uiStep === uiStep,
			);
			if (currentIndex === -1) return;

			// Find next step that doesn't skip
			for (let i = currentIndex + 1; i < ONBOARDING_STEPS.length; i++) {
				const stepConfig = ONBOARDING_STEPS[i];
				if (!stepConfig.shouldSkip?.(currentState)) {
					set({ uiStep: stepConfig.uiStep });
					return;
				}
			}
		},

		goBack: () => {
			const { uiStep } = get();
			const currentState = get();
			set({ direction: -1 });

			// Find current step index
			const currentIndex = ONBOARDING_STEPS.findIndex(
				(s) => s.uiStep === uiStep,
			);
			if (currentIndex === -1) return;

			// Find previous step that doesn't skip
			for (let i = currentIndex - 1; i >= 0; i--) {
				const stepConfig = ONBOARDING_STEPS[i];
				if (!stepConfig.shouldSkip?.(currentState)) {
					set({ uiStep: stepConfig.uiStep });
					return;
				}
			}
		},

		completeServerStep: () => {
			set((s) => ({ step: s.step + 1 }));
			get().goNext();
		},
	}));
};
