"use client";
import SereneLogo from "@/lib/components/common/serene-logo";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { AnimatePresence, motion } from "motion/react";
import PasswordLock from "./password-lock";

export default function HomeLock() {
  const preferences = usePasswordLockStore();

  return (
    <AnimatePresence>
      {preferences.isLocked && (
        <motion.div
          className="fixed inset-0 z-50 grid grid-rows-3 h-screen py-20 px-20 bg-background"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          <motion.section
            className="flex justify-center items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(5px)" }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <SereneLogo textSize="text-4xl" className="gap-4" />
          </motion.section>
          <motion.section
            className="flex items-center flex-col justify-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.h2
              className="font-medium font-sans text-2xl md:text-3xl md:text-5xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Grant access to your inner world.
            </motion.h2>
            <PasswordLock />
          </motion.section>
          <motion.section
            className="flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* <DailyAffirmations colour="text-black opacity-50" /> */}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
