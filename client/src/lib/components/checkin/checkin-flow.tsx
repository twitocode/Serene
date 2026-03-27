import { CHECKIN_STEPS } from "@/lib/components/checkin/checkin-config";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { TransitionType, getVariants } from "@/lib/helpers/get-variants";
import { AnimatePresence, motion } from "motion/react";

export default function CheckinFlow() {
  const { direction, step } = useCheckinStore((s) => s);

  const transitionType: TransitionType = "scale";
  const variants = getVariants(transitionType);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-full w-full flex-1 flex-col"
    >
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: 0.2 },
              }}
              className="flex min-h-0 w-full flex-1 flex-col"
            >
              {(() => {
                const activeConfig = CHECKIN_STEPS.find((a) => a.step === step);
                if (!activeConfig) return null;
                const ActiveComponent = activeConfig.component;
                return <ActiveComponent />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
