"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import {
	type CheckinProps,
	type CheckinState,
	type CheckinStore,
	createCheckinStore,
} from "@/lib/hooks/stores/checkin-store";
import {
	createOnboardingStore,
	type OnboardingProps,
	type OnboardingState,
	type OnboardingStore,
} from "@/lib/hooks/stores/onboarding-store";

export const OnboardingContext = createContext<OnboardingStore | undefined>(
	undefined,
);

interface OnboardingProviderProps extends OnboardingProps {
	children: ReactNode;
}

export const OnboardingProvider = ({
	children,
	...props
}: OnboardingProviderProps) => {
	const [store] = useState(() => createOnboardingStore(props));

	return (
		<OnboardingContext.Provider value={store}>
			{children}
		</OnboardingContext.Provider>
	);
};

export const CheckinContext = createContext<CheckinStore | undefined>(
	undefined,
);

interface CheckinProviderProps extends CheckinProps {
	children: ReactNode;
}

export const CheckinProvider = ({
	children,
	...props
}: CheckinProviderProps) => {
	const [store] = useState(() => createCheckinStore(props));

	return (
		<CheckinContext.Provider value={store}>{children}</CheckinContext.Provider>
	);
};

export const useOnboardingStore = <T,>(
	selector: (store: OnboardingState) => T,
): T => {
	const context = useContext(OnboardingContext);
	if (!context) {
		throw new Error(
			`useOnboardingStore must be used within OnboardingProvider`,
		);
	}
	return useStore(context, selector);
};

export const useCheckinStore = <T,>(
	selector: (store: CheckinState) => T,
): T => {
	const context = useContext(CheckinContext);
	if (!context) {
		throw new Error(`useCheckinStore must be used within CheckinProvider`);
	}
	return useStore(context, selector);
};
