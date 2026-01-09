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
      scale: [1, 1.2, 1],
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
      className="inline-flex items-center justify-center cursor-pointer text-indigo-600 bg-transparent border-none p-0 focus:outline-none"
      animate={controls}
      whileHover={!isRolling ? { scale: 1.1 } : {}}
      whileTap={!isRolling ? { scale: 0.9 } : {}}
      onClick={handleRoll}
      aria-label="Roll dice for new prompt"
    >
      <Dices size={32} />
    </motion.button>
  );
};