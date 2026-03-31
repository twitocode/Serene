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

	const { lockInterval, tick, setLockState, startInterval } =
		usePasswordLockStore();

	const timeout = 1000 * 60 * 60;

	useEffect(() => {
		usePasswordLockStore.persist.rehydrate();

		if (!lockInterval.isRunning && settings?.passwordLock) {
			startInterval();
		}
	}, [settings?.passwordLock, lockInterval.isRunning, startInterval]);

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
			lockInterval: {
				...lockInterval,
				intervalId: intervalId as unknown as number,
			},
		});

		return () => {
			clearInterval(intervalId);
		};
	}, [
		lockInterval.isRunning,
		tick,
		lockInterval,
		settings?.passwordLock,
		setLockState,
	]);

	return <div>{children}</div>;
}
