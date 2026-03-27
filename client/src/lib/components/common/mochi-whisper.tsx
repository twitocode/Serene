"use client";

import { MochiHappy } from "@/lib/components/common/mochi";
import { Button } from "@/lib/components/ui/button";
import { pickMochiWhisper } from "@/lib/data/mochi-whispers";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** First visit: ~1.5–3 min. Later: ~4–9 min between whispers. */
const INITIAL_DELAY_MS_MIN = 90_000;
const INITIAL_DELAY_MS_EXTRA = 90_000;
const BETWEEN_MS_MIN = 240_000;
const BETWEEN_MS_EXTRA = 300_000;
const AUTO_DISMISS_MS = 16_000;
const HIDDEN_TAB_RETRY_MS = 60_000;

export function MochiWhisper() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const reduceMotion = useReducedMotion();
  const prevMessageRef = useRef<string | undefined>(undefined);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearNextTimer = () => {
    if (nextTimerRef.current != null) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
  };

  const scheduleNextAppearance = useCallback((delayMs: number) => {
    clearNextTimer();
    nextTimerRef.current = setTimeout(() => {
      nextTimerRef.current = null;
      if (typeof document !== "undefined" && document.hidden) {
        scheduleNextAppearance(HIDDEN_TAB_RETRY_MS);
        return;
      }
      const msg = pickMochiWhisper(prevMessageRef.current);
      prevMessageRef.current = msg;
      setMessage(msg);
      setOpen(true);
    }, delayMs);
  }, []);

  useEffect(() => {
    scheduleNextAppearance(
      INITIAL_DELAY_MS_MIN + Math.random() * INITIAL_DELAY_MS_EXTRA,
    );
    return () => clearNextTimer();
  }, [scheduleNextAppearance]);

  const closeWhisper = useCallback(() => {
    setOpen(false);
    scheduleNextAppearance(BETWEEN_MS_MIN + Math.random() * BETWEEN_MS_EXTRA);
  }, [scheduleNextAppearance]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(closeWhisper, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [open, closeWhisper]);

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.aside
          key={message}
          initial={
            reduceMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 12, scale: 0.98 }
          }
          transition={
            reduceMotion
              ? { duration: 0.12 }
              : { type: "spring", stiffness: 420, damping: 32 }
          }
          className={cn(
            "fixed bottom-4 right-4 z-[100] flex w-[min(22rem,calc(100vw-1.5rem))] gap-3 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-lg backdrop-blur-md md:bottom-6 md:right-6",
            "max-md:left-4 max-md:right-4 max-md:w-auto",
          )}
          role="status"
          aria-live="polite"
          aria-label="A note from Mochi"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <MochiHappy className="size-11" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Mochi
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {message}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => closeWhisper()}
            aria-label="Dismiss message"
          >
            <X className="size-4" />
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
