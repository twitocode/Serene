"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";
import { createOnboardingStore, OnboardingProps, OnboardingState, OnboardingStore } from "@/lib/hooks/stores/onboarding-store";

export const OnboardingContext = createContext<OnboardingStore | undefined>(
  undefined
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

// The Hook to use in Client Components
export const useOnboardingStore = <T,>(
  selector: (store: OnboardingState) => T
): T => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      `useOnboardingStore must be used within OnboardingProvider`
    );
  }
  return useStore(context, selector);
};
