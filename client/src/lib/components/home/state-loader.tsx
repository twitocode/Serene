"use client";

import { Toaster } from "@/lib/components/ui/sonner";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { User } from "@/lib/types";
import { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  user: User | undefined;
}

export default function StateLoader({
  children,
  user,
}: PropsWithChildren<Props>) {
  const {
    lockInterval,
    tick,
    setLockState,
    isLocked,
    startInterval,
    stopInterval,
  } = usePreferencesStore();

  const timeout = 1000 * 60 * 60;

  useEffect(() => {
    usePreferencesStore.persist.rehydrate();

    if (!lockInterval.isRunning && user?.preferences?.pageLock) {
      startInterval();
    }
  }, []);

  useEffect(() => {
    if (!user?.preferences?.pageLock) return;
    if (!lockInterval.isRunning) return;

    const intervalId = setInterval(() => {
      tick();
      console.log("Interval tick!");

      // Get the latest state value
      const currentLocked = usePreferencesStore.getState().isLocked;
      setLockState(!currentLocked);
    }, timeout);

    usePreferencesStore.setState({
      lockInterval: { ...lockInterval, intervalId: intervalId as any },
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [lockInterval.isRunning, tick]);

  return <div>{children}</div>;
}
