"use client";

import { useTheme } from "next-themes";
import { type PropsWithChildren, useEffect } from "react";
import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";

export default function StateLoader({ children }: PropsWithChildren) {
	const { data: settings } = useSettingsQuery();

	const { setTheme } = useTheme();

	useEffect(() => {
		if (settings?.theme) {
			setTheme(settings.theme.toLowerCase());
		}
	}, [settings?.theme, setTheme]);

	const lockIntervalRunning = usePasswordLockStore(
		(state) => state.lockInterval.isRunning,
	);
	const tick = usePasswordLockStore((state) => state.tick);
	const setLockState = usePasswordLockStore((state) => state.setLockState);
	const startInterval = usePasswordLockStore((state) => state.startInterval);

	const timeout = 1000 * 60 * 60;

	useEffect(() => {
		usePasswordLockStore.persist.rehydrate();

		if (!lockIntervalRunning && settings?.passwordLock) {
			startInterval();
		}
	}, [settings?.passwordLock, lockIntervalRunning, startInterval]);

	useEffect(() => {
		if (!settings?.passwordLock) return;
		if (!lockIntervalRunning) return;

		const intervalId = setInterval(() => {
			tick();

			// Get the latest state value
			const currentLocked = usePasswordLockStore.getState().isLocked;
			setLockState(!currentLocked);
		}, timeout);

		usePasswordLockStore.setState((state) => ({
			lockInterval: {
				...state.lockInterval,
				intervalId: intervalId as unknown as number,
			},
		}));

		return () => {
			clearInterval(intervalId);
		};
	}, [lockIntervalRunning, tick, settings?.passwordLock, setLockState]);

	return <div>{children}</div>;
}
