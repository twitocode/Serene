"use client";

import { motion } from "motion/react";
import InterestPicker from "@/lib/components/community/interest-picker";
import PeerMatchCard from "@/lib/components/community/peer-match-card";
import { Separator } from "@/lib/components/ui/separator";
import { useInterestsQuery } from "@/lib/hooks/queries/use-peers";

export function PeerMatchSection() {
  const { data: interests = [] } = useInterestsQuery();
  const hasInterests = interests.length >= 3;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <Separator className="mb-8 bg-border/80" />

      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Wellness buddy
      </h3>

      {hasInterests ? (
        <PeerMatchCard />
      ) : (
        <div className="card-organic border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm">
          <InterestPicker />
        </div>
      )}
    </motion.section>
  );
}
