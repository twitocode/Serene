import { createStore } from "zustand/vanilla";

// 1. Define the props that might come from the Server (DB)
export interface OnboardingProps {
  initialStep?: number;
  initialHasStarted?: boolean;
  initialName?: string;
  initialAge?: number;
  initialGender?: string;
  initialPronouns?: string;
  initialCountryCode?: string;
  initialSchool?: string;
  initialKoalaName?: string;
  initialKoalaColour?: string;
  initialKoalaPronouns?: string;
}

export interface OnboardingState {
  // Current values
  name: string;
  age: number;
  gender: string;
  pronouns: string;
  countryCode: string;
  school: string;
  koalaName: string;
  koalaColour: string;
  koalaPronouns: string;

  // Initial values from server (to check if already set)
  initialName: string;
  initialAge: number;
  initialGender: string;
  initialPronouns: string;
  initialCountryCode: string;
  initialSchool: string;
  initialKoalaName: string;
  initialKoalaColour: string;
  initialKoalaPronouns: string;

  // Flow Control
  step: number; // Server step
  uiStep: number; // Visual step
  hasStarted: boolean;
  direction: number;

  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
  setPronouns: (pronouns: string) => void;
  setCountryCode: (country: string) => void;
  setSchool: (school: string) => void;
  setKoalaName: (name: string) => void;
  setKoalaColor: (color: string) => void;
  setKoalaPronouns: (pronouns: string) => void;

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
    age: initProps?.initialAge || 0,
    gender: initProps?.initialGender || "",
    pronouns: initProps?.initialPronouns || "",
    countryCode: initProps?.initialCountryCode || "",
    school: initProps?.initialSchool || "",
    koalaName: initProps?.initialKoalaName || "",
    koalaColour: initProps?.initialKoalaColour || "#5EEAD4",
    koalaPronouns: initProps?.initialKoalaPronouns || "",

    // Initial State (preserved for comparison)
    initialName: initProps?.initialName || "",
    initialAge: initProps?.initialAge || 0,
    initialGender: initProps?.initialGender || "",
    initialPronouns: initProps?.initialPronouns || "",
    initialCountryCode: initProps?.initialCountryCode || "",
    initialSchool: initProps?.initialSchool || "",
    initialKoalaName: initProps?.initialKoalaName || "",
    initialKoalaColour: initProps?.initialKoalaColour || "#5EEAD4",
    initialKoalaPronouns: initProps?.initialKoalaPronouns || "",

    direction: 0,
    step: initialStep,
    uiStep: initialUiStep,
    hasStarted,

    // Actions
    setName: (name) => set({ name }),
    setAge: (age) => set({ age }),
    setGender: (gender) => set({ gender }),
    setPronouns: (pronouns) => set({ pronouns }),
    setCountryCode: (countryCode) => set({ countryCode }),
    setSchool: (school) => set({ school }),
    setKoalaName: (koalaName) => set({ koalaName }),
    setKoalaColor: (koalaColour) => set({ koalaColour }),
    setKoalaPronouns: (koalaPronouns) => set({ koalaPronouns }),

    goNext: () => {
      const { step, uiStep, initialName } = get();
      set({ direction: 1 });

      if (uiStep === 0) {
        let nextUiStep = 1;
        switch (step) {
          case 1:
            nextUiStep = 2;
            break;
          case 2:
            nextUiStep = 4;
            break;
          case 3:
            nextUiStep = 5;
            break;
          case 4:
            nextUiStep = 6;
            break;
          case 5:
            nextUiStep = 7;
            break;
          default:
            nextUiStep = 1;
        }
        set({ uiStep: nextUiStep });
        return;
      }

      // Skip "Hello, {name}" (uiStep 3) if moving from StepOne (uiStep 2) and name was already claimed
      if (uiStep === 2 && initialName) {
        set({ uiStep: 4 });
        return;
      }

      set((state) => ({ uiStep: state.uiStep + 1 }));
    },

    goBack: () => {
      const { uiStep } = get();
      set({ direction: -1 });
      let prevUiStep = uiStep - 1;
      if (uiStep === 4) prevUiStep = 2;
      if (uiStep === 2) prevUiStep = 1;
      set({ uiStep: prevUiStep });
    },

    completeServerStep: () => {
      set((s) => ({ step: s.step + 1 }));
      get().goNext();
    },
  }));
};
