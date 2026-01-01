import { Preference, Theme } from "@serene/shared/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PreferenceState = Omit<Preference, "user" | "createdAt" | "userId"> & {
  isLocked: boolean;
  lockInterval: {
    isRunning: boolean;
    intervalId: number | null;
    count: number;
    lastTick: number | null;
  };
  setLockState: (state: boolean) => void;
  startInterval: () => void;
  stopInterval: () => void;
  tick: () => void;
};

export const usePreferencesStore = create(
  persist<PreferenceState>(
    (set, get) => ({
      pageLock: "40",
      isLocked: false,
      theme: Theme.Light,
      lockInterval: {
        isRunning: false,
        intervalId: null,
        count: 0,
        lastTick: null,
      },

      setLockState: (newLockState) => set({ isLocked: newLockState }),
      startInterval: () => {
        set((state) => ({
          lockInterval: {
            ...state.lockInterval,
            isRunning: true,
            lastTick: Date.now(),
          },
        }));
      },

      stopInterval: () => {
        const { intervalId } = get().lockInterval;
        if (intervalId) {
          clearInterval(intervalId);
        }
        set((state) => ({
          lockInterval: {
            ...state.lockInterval,
            isRunning: false,
            intervalId: null,
          },
        }));
      },

      tick: () =>
        set((state) => ({
          lockInterval: {
            ...state.lockInterval,
            count: state.lockInterval.count! + 1,
            lastTick: Date.now(),
          },
        })),
    }),
    {
      name: "interval-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state): any => ({
        isLocked: state.isLocked,
        lockInterval: {
          isRunning: state.lockInterval.isRunning,
          count: state.lockInterval.count,
          lastTick: state.lockInterval.lastTick,
        },
      }),
    }
  )
);
