"use client";

import { fetchUser } from "@/lib/server/get-user";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

interface Props {}

export default function StateLoader({ children }: PropsWithChildren<Props>) {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: fetchUser });

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
