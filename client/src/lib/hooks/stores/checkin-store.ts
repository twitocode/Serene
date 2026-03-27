import { Mood } from "@/lib/data/moods";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { GridPoint } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export interface CheckinProps {
  initialDisplayDate?: string;
}

export interface CheckinState {
  displayDate: string;
  isCheckingIn: boolean;
  selectedMood: Mood | null;

  step: number;
  direction: number;

  somaticState: { [key: string]: GridPoint };
  lingeringThoughts: string | null;
  reframedThought: string | null;
  moodLabel: string;
  moodSeverity: number;

  setSelectedMood: (mood: Mood) => void;
  setSomaticState: (state: { [key: string]: GridPoint }) => void;
  setLingeringThoughts: (thoughts: string) => void;
  setReframedThought: (thoughts: string) => void;
  setMoodSeverity: (severity: number) => void;

  goNext: () => void;
  goBack: () => void;

  complete: () => void;
  toggleIsCheckingIn: () => void;
  startCheckin: () => void;
  cancel: () => void;
  changeDate: (date: string) => void;
}

export type CheckinStore = ReturnType<typeof createCheckinStore>;

export const createCheckinStore = (initProps?: CheckinProps) => {
  return createStore<CheckinState>((set) => ({
    displayDate: initProps?.initialDisplayDate || getCurrentDate(),

    selectedMood: null,
    isCheckingIn: false,
    step: 0,
    direction: 0,

    lingeringThoughts: "",
    reframedThought: "",
    moodLabel: "",
    moodSeverity: -1,
    somaticState: {},
    setSelectedMood: (mood: Mood) =>
      set({
        selectedMood: mood,
        moodSeverity: mood.severity,
        moodLabel: mood.label,
      }),
    setSomaticState: (state: { [key: string]: GridPoint }) =>
      set({ somaticState: state }),
    setLingeringThoughts: (thoughts: string) =>
      set({ lingeringThoughts: thoughts }),
    setReframedThought: (thoughts: string) => set({ reframedThought: thoughts }),
    setMoodSeverity: (severity: number) => set({ moodSeverity: severity }),
    goNext: () => {
      set(({ step }) => ({ step: step + 1 }));
    },
    goBack: () => {
      set(({ step }) => ({ step: step > 0 ? step - 1 : step }));
    },
    changeDate: (date: string) => set({ displayDate: date }),
    toggleIsCheckingIn: () =>
      set(({ isCheckingIn }) => ({ isCheckingIn: !isCheckingIn })),
    startCheckin: () => set({ isCheckingIn: true, step: 0 }),
    cancel: () => set({ isCheckingIn: false, step: 0 }),
    complete: async () => {
      set({
        lingeringThoughts: "",
        reframedThought: "",
        moodLabel: "",
        moodSeverity: -1,
        somaticState: {},
        isCheckingIn: false,
        step: 0,
      });
    },
  }));
};
