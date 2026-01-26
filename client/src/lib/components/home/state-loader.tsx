"use client";

import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { useTheme } from "next-themes";
import { PropsWithChildren, useEffect } from "react";



export default function StateLoader({ children }: PropsWithChildren) {
  const {data: settings} = useSettingsQuery();

  const {setTheme} = useTheme();

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme.toLowerCase());
    }
  }, [settings?.theme, setTheme]);

  const {
    lockInterval,
    tick,
    setLockState,
    isLocked,
    startInterval,
    stopInterval,
  } = usePasswordLockStore();

  const timeout = 1000 * 60 * 60;

  useEffect(() => {
    usePasswordLockStore.persist.rehydrate();

    if (!lockInterval.isRunning && settings?.passwordLock) {
      startInterval();
    }
  }, []);

  useEffect(() => {
    if (!settings?.passwordLock) return;
    if (!lockInterval.isRunning) return;

    const intervalId = setInterval(() => {
      tick();

      // Get the latest state value
      const currentLocked = usePasswordLockStore.getState().isLocked;
      setLockState(!currentLocked);
    }, timeout);

    usePasswordLockStore.setState({
      lockInterval: { ...lockInterval, intervalId: intervalId as any },
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [lockInterval.isRunning, tick]);

  return <div>{children}</div>;
}
