import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { createStore } from "zustand/vanilla";

export interface CheckinProps {
  initialDisplayDate?: string;
}

export interface CheckinState {
  displayDate: string;
  isCheckingIn: boolean;

  step: number;
  direction: number;

  promptAnswer: string | null;
  somaticState: [];
  lingeringThoughts: string | null;
  moodLabel: string;
  promptQuestion: string;
  moodSeverity: number;

  goNext: () => void;
  goBack: () => void;

  toggleIsCheckingIn: () => void;
  changeDate: (date: string) => void;
}

export type CheckinStore = ReturnType<typeof createCheckinStore>;

export const createCheckinStore = (initProps?: CheckinProps) => {
  return createStore<CheckinState>((set) => ({
    displayDate: initProps?.initialDisplayDate || getCurrentDate(),
    
    isCheckingIn: false,
    step: 0,
    direction: 0,

    promptAnswer: "",
    lingeringThoughts: "",
    moodLabel: "",
    promptQuestion: "",
    moodSeverity: -1,
    somaticState: [],

    goNext: () => {
      set(({ step }) => ({ step: step + 1 }));
    },
    goBack: () => {
      set(({ step }) => ({ step: step - 1 }));
    },
    changeDate: (date: string) => set({ displayDate: date }),
    toggleIsCheckingIn: () =>
      set(({ isCheckingIn }) => ({ isCheckingIn: !isCheckingIn })),
  }));
};
