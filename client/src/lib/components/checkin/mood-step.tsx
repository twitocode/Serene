import MoodPicker from "@/lib/components/checkin/mood-picker";
import Penguin from "@/lib/components/penguin";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-bottom";
import { Brain, CloudLightning, Heart, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEventHandler, useState } from "react";

export default function MoodStep() {
  const { goNext, selectedMood, setSelectedMood } = useCheckinStore((s) => s);
  const isMobile = useIsMobile();
  const [hasSelected, setHasSelected] = useState(selectedMood != null);
  const [scrollRef, scrollToBottom] = useScrollToBottom<HTMLFormElement>();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (selectedMood != null) {
      goNext();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-between items-center p-4 gap-10"
      ref={scrollRef}
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="flex items-center justify-center">
          {/* Swap with imageUrl prop */}
          <Penguin colour="red" />
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="flex flex-col">
            <h1 className="text-3xl text-center md:text-left">
              Describe your current mood
            </h1>
            <span className="text-muted-foreground text-center md:text-left text-md">
              Choose only one
            </span>
          </div>
          <MoodPicker
            setHasSelected={setHasSelected}
            scrollToBottom={scrollToBottom}
            type="vibe"
            Icon={Heart}
            iconColour="red"
          />
          <MoodPicker
            setHasSelected={setHasSelected}
            scrollToBottom={scrollToBottom}
            type="energy"
            Icon={CloudLightning}
            iconColour="orange"
          />
          <MoodPicker
            setHasSelected={setHasSelected}
            scrollToBottom={scrollToBottom}
            type="mental"
            Icon={Brain}
            iconColour="purple"
          />
          <MoodPicker
            setHasSelected={setHasSelected}
            scrollToBottom={scrollToBottom}
            type="status"
            Icon={Shield}
            iconColour="blue"
          />
          <div className="min-h-[80px] w-full flex justify-center md:justify-normal items-center">
            <AnimatePresence>
              {hasSelected && (
                <motion.div
                  key="next-button"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.4 }}
                  className="w-full md:w-auto"
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="px-10 text-lg w-full"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </form>
  );
}
