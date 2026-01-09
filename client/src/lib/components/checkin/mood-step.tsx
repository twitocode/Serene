import MoodPicker from "@/lib/components/checkin/mood-picker";
import Penguin from "@/lib/components/penguin";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { MOODS } from "@/lib/data/moods";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEventHandler, useState } from "react";

export default function MoodStep() {
  const { goNext, selectedMood, setSelectedMood } = useCheckinStore((s) => s);
  const isMobile = useIsMobile();
  const [hasSelected, setHasSelected] = useState(selectedMood != null);

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
    >
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="flex items-center justify-center">
          {/* Swap with imageUrl prop */}
          <Penguin colour="red" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl text-center md:text-left">Describe your current mood</h1>
          <MoodPicker setHasSelected={setHasSelected} type="vibe" icon={Heart} iconColour="red" />
          <MoodPicker setHasSelected={setHasSelected} type="energy" icon={Heart} iconColour="orange" />
          <MoodPicker setHasSelected={setHasSelected} type="mental" icon={Heart} iconColour="purple" />
          <MoodPicker setHasSelected={setHasSelected} type="status" icon={Heart} iconColour="blue" />
        </div>
      </div>
      <div className="min-h-[80px] w-full flex justify-center items-center">
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
            >
              <Button type="submit" size="lg" className="px-10 text-lg">
                Next
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
