import { Mood } from "@/lib/data/moods";
import { getRandomPrompt } from "@/lib/data/prompts";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { GridPoint } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export interface CheckinProps {
  initialDisplayDate?: string;
  initialPromptQuestion?: string;
}

export interface CheckinState {
  displayDate: string;
  isCheckingIn: boolean;
  selectedMood: Mood | null;

  step: number;
  direction: number;

  promptAnswer: string | null;
  promptQuestion: string;
  somaticState: { [key: string]: GridPoint };
  lingeringThoughts: string | null;
  moodLabel: string;
  moodSeverity: number;

  setSelectedMood: (mood: Mood) => void;
  setSomaticState: (state: { [key: string]: GridPoint }) => void;
  randomizePrompt: () => void;

  goNext: () => void;
  goBack: () => void;

  complete: () => void;
  toggleIsCheckingIn: () => void;
  changeDate: (date: string) => void;
}

export type CheckinStore = ReturnType<typeof createCheckinStore>;

export const createCheckinStore = (initProps?: CheckinProps) => {
  return createStore<CheckinState>((set) => ({
    displayDate: initProps?.initialDisplayDate || getCurrentDate(),
    promptQuestion:
      initProps?.initialPromptQuestion || getRandomPrompt().question,

    selectedMood: null,
    isCheckingIn: false,
    step: 0,
    direction: 0,

    promptAnswer: "",
    lingeringThoughts: "",
    moodLabel: "",
    moodSeverity: -1,
    somaticState: {},
    setSelectedMood: (mood: Mood) => set({ selectedMood: mood }),
    setSomaticState: (state: { [key: string]: GridPoint }) =>
      set({ somaticState: state }),
    randomizePrompt: () =>
      set((state) => ({
        promptQuestion: getRandomPrompt(state.promptQuestion).question,
      })),
    goNext: () => {
      set(({ step }) => ({ step: step + 1 }));
    },
    goBack: () => {
      set(({ step }) => ({ step: step > 0 ? step - 1 : step }));
    },
    changeDate: (date: string) => set({ displayDate: date }),
    toggleIsCheckingIn: () =>
      set(({ isCheckingIn }) => ({ isCheckingIn: !isCheckingIn })),
    complete: async () => {
      set({
        promptAnswer: "",
        lingeringThoughts: "",
        moodLabel: "",
        moodSeverity: -1,
        somaticState: {},
      });
    },
  }));
};
