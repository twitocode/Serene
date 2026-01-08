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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="min-h-screen flex items-center justify-center p-4 w-full">
        <div className="w-full h-screen max-h-screen  rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 relative flex flex-col overflow-hidden">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex-1 flex items-center justify-center "
              >
                {(() => {
                  const activeConfig = CHECKIN_STEPS.find(
                    (a) => a.step === step
                  );
                  if (!activeConfig) return null;
                  const ActiveComponent = activeConfig.component;
                  return <ActiveComponent />;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
