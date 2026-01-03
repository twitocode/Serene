import {
  completeStep1,
  completeStep2,
  completeStep3,
  completeStep4,
  completeStep5,
} from "@/lib/client/onboarding-client";
import { schools } from "@/lib/data";
import { create } from "zustand";

interface OnboardingState {
  name: string;
  age: number;
  gender: string;
  pronouns: string;
  country: string;
  school: string;
  koalaName: string;
  koalaColour: string;
  koalaPronouns: string;

  // Flow Control
  step: number; // Server step
  uiStep: number; // Visual step
  direction: number;

  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: string) => void;
  setPronouns: (pronouns: string) => void;
  setCountry: (country: string) => void;
  setSchool: (school: string) => void;
  setKoalaName: (name: string) => void;
  setKoalaColor: (color: string) => void;
  setKoalaPronouns: (pronouns: string) => void;
  
  goNext: () => void;
  goBack: () => void;
  submitStep: () => Promise<void>;
  initialize: (initialStep: number, hasStarted: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  name: "",
  age: 0,
  gender: "",
  pronouns: "",
  country: "",
  school: "",
  koalaName: "",
  koalaColour: "",
  koalaPronouns: "",
  step: 1,
  uiStep: 1,
  direction: 0,

  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setPronouns: (pronouns) => set({ pronouns }),
  setCountry: (country) => set({ country }),
  setSchool: (school) => set({ school }),
  setKoalaName: (koalaName) => set({ koalaName }),
  setKoalaColor: (koalaColour) => set({ koalaColour }),
  setKoalaPronouns: (koalaPronouns) => set({ koalaPronouns }),

  initialize: (initialStep, hasStarted) => {
    set({ 
      step: initialStep,
      uiStep: hasStarted ? 0 : 1 // 0 = Returning, 1 = Intermediate Step 1
    });
  },

  goNext: () => {
    const { step, uiStep } = get();
    set({ direction: 1 });
    
    // Logic for returning users jumping to correct step
    if (uiStep === 0) {
      let nextUiStep = 1;
      switch (step) {
        case 1: nextUiStep = 2; break; // StepOne
        case 2: nextUiStep = 4; break; // StepTwo
        case 3: nextUiStep = 5; break; // StepThree
        case 4: nextUiStep = 6; break; // StepFour
        case 5: nextUiStep = 7; break; // StepFive
        default: nextUiStep = 1; // IntermediateStepOne
      }
      set({ uiStep: nextUiStep });
      return;
    }

    set((state) => ({ uiStep: state.uiStep + 1 }));
  },

  goBack: () => {
    const { uiStep } = get();
    set({ direction: -1 });

    let prevUiStep = uiStep - 1;
    // Skip intermediate steps when going back logic
    if (uiStep === 4) prevUiStep = 2;
    if (uiStep === 2) prevUiStep = 1; 

    set({ uiStep: prevUiStep });
  },

  submitStep: async () => {
    const state = get();
    try {
      if (state.step === 1) await completeStep1(state.name);
      if (state.step === 2)
        await completeStep2(state.age, state.gender, state.pronouns.replace("-", " "));
      if (state.step === 3) await completeStep3(state.country);
      if (state.step === 4) {
        const schoolObj = schools.find((s) => s.name === state.school)!;
        await completeStep4(schoolObj);
      }
      if (state.step === 5) {
        await completeStep5(state.koalaName, state.koalaPronouns, state.koalaColour);
        window.location.href = "/home";
        return;
      }

      set((s) => ({ step: s.step + 1 }));
      get().goNext();
    } catch (error) {
      // console.error(error);
      throw error;
    }
  },
}));
