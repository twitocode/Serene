"use client";

import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { getVariants, TransitionType } from "@/lib/helpers/get-variants";
import { AnimatePresence, motion } from "motion/react";
import { ONBOARDING_STEPS } from "./onboarding-config";

export function OnboardingFlow() {
  const { uiStep, direction } = useOnboardingStore((state) => state);

  const transitionType: TransitionType = "scale";
  const variants = getVariants(transitionType);

  const getProgressStep = (currentUIStep: number): number => {
    const stepConfig = ONBOARDING_STEPS.find(
      (step) => step.uiStep === currentUIStep
    );
    return stepConfig?.progress || 1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center lg:p-4 w-full">
      <div className="w-full max-w-2xl min-h-[800px] bg-background rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={uiStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex-1 flex items-center justify-center p-8"
            >
              {(() => {
                const activeConfig = ONBOARDING_STEPS.find(
                  (step) => step.uiStep === uiStep
                );
                if (!activeConfig) return null;
                const ActiveComponent = activeConfig.component;
                return <ActiveComponent />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pb-8 flex justify-center gap-2 bg-background">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i === getProgressStep(uiStep) ? 1.2 : 1,
                backgroundColor:
                  i === getProgressStep(uiStep) ? "#000" : "#d1d5db",
              }}
              transition={{ duration: 0.2 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
