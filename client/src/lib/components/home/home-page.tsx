"use client";

import RecentBadges from "@/lib/components/achievements/recent-badges";
import { MochiDefault, MochiHappy } from "@/lib/components/common/mochi";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { motion } from "framer-motion";
import { Flower2, Sparkles, Wind } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const suggestions = [
  { id: "1", icon: MochiDefault, title: "Talk to Mochi", hint: "Companion chat" },
  { id: "2", icon: Flower2, title: "Daily affirmations", hint: "Gentle words" },
  { id: "3", icon: Wind, title: "Box breathing", hint: "Ground your body" },
];

export default function HomePage() {
  const router = useRouter();
  const { startCheckin } = useCheckinStore((s) => s);

  const handleStartCheckin = () => {
    startCheckin();
    router.push("/home/checkin");
  };

  return (
    <div className="relative mx-auto flex min-h-full max-w-2xl flex-col gap-10 px-4 py-6 md:py-10">
      <div className="flex flex-col gap-2">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          Today
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
        >
          Good morning
        </motion.h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          However you feel right now is valid. Take a breath this space is yours.
        </p>
      </div>

      <DateScroll readOnly />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="card-organic relative overflow-hidden border-border/80 bg-card p-6 shadow-md md:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-warm/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <MochiHappy className="size-36 drop-shadow-sm md:size-40" />
          </div>
          <div className="flex max-w-md flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="size-3.5" />
              Quick check-in
            </div>
            <h2 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
              Stressed about exams or deadlines?
            </h2>
            <p className="text-sm text-muted-foreground">
              A short guided check-in can help name what you&apos;re carrying, at
              your pace, with no judgment.
            </p>
            <Button
              onClick={handleStartCheckin}
              size="lg"
              className="btn-playful w-full sm:w-auto"
            >
              Start a check-in
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Suggested for you
            </h3>
            <p className="text-sm text-muted-foreground">
              Small steps you can take today
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            const link = `/home/explore/${suggestion.id}`;

            return (
              <Link href={link} key={suggestion.id} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 + index * 0.06 }}
                  className="card-organic flex h-full flex-col gap-3 border-border/80 bg-card/80 p-5 transition-all duration-200 hover:border-primary/25 hover:bg-card hover:shadow-md"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/80 text-accent-foreground ring-1 ring-border/60 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="size-7" strokeWidth={1.25} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-snug text-foreground">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{suggestion.hint}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <RecentBadges />
    </div>
  );
}
