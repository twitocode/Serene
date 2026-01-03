import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ClientLockState {
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
}

interface PersistedState {
  isLocked: boolean;
  lockInterval: {
    isRunning: boolean;
    count: number;
    lastTick: number | null;
  };
}

export const usePasswordLockStore = create<ClientLockState>()(
  persist(
    (set, get) => ({
      isLocked: false,
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
            count: state.lockInterval.count + 1,
            lastTick: Date.now(),
          },
        })),
    }),
    {
      name: "interval-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Mapping the state to the PersistedState interface
      partialize: (state): PersistedState => ({
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
