"use client";

import { ApiError } from "@/lib/helpers/api-fetch";
import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { fetchUser } from "@/lib/server/get-user";
import { User } from "@/lib/types/index";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { PropsWithChildren, useEffect } from "react";



export default function StateLoader({ children }: PropsWithChildren) {
  const {data: settings} = useSettingsQuery();

  const {setTheme} = useTheme();

  useEffect(() => {
    setTheme(settings?.theme.toLowerCase() ?? "dark");
  }, [])

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
      console.log("Interval tick!");

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
