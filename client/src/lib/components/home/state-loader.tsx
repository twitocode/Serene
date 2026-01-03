"use client";

import { ApiError } from "@/lib/helpers/api-fetch";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { fetchUser } from "@/lib/server/get-user";
import { User } from "@/lib/types/index";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

interface Props {}

export default function StateLoader({ children }: PropsWithChildren<Props>) {
  const { data: user } = useQuery<User, ApiError>({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

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

    if (!lockInterval.isRunning && user?.preferences?.passwordLock) {
      startInterval();
    }
  }, []);

  useEffect(() => {
    if (!user?.preferences?.passwordLock) return;
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
