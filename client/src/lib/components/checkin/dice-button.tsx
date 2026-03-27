import { motion, useAnimation } from "framer-motion";
import { Dices } from "lucide-react";
import { useState } from "react";

export const DiceButton = ({ onRoll }: { onRoll: () => void }) => {
  const controls = useAnimation();
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRolling) return;
    setIsRolling(true);

    controls.start({
      rotate: [0, 360],
      scale: [1, 1.15, 1],
      transition: { duration: 0.6, ease: "easeInOut" },
    });

    setTimeout(() => {
      onRoll();
      setIsRolling(false);
    }, 600);
  };

  return (
    <motion.button
      type="button"
      className="inline-flex items-center justify-center rounded-2xl border border-border/80 bg-accent/40 p-4 text-primary shadow-sm transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      animate={controls}
      whileHover={!isRolling ? { scale: 1.05 } : {}}
      whileTap={!isRolling ? { scale: 0.96 } : {}}
      onClick={handleRoll}
      aria-label="Roll dice for a new prompt"
    >
      <Dices className="size-8" strokeWidth={1.75} />
    </motion.button>
  );
};
