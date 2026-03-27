"use client";

import { Button } from "@/lib/components/ui/button";
import { useInterestsQuery, useUpdateInterestsMutation } from "@/lib/hooks/queries/use-peers";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const AVAILABLE_INTERESTS = [
  "Music", "Hiking", "Gaming", "Cooking", "Reading", "Photography",
  "Art & Design", "Fitness", "Film & TV", "Writing", "Coding",
  "Fashion", "Travel", "Volunteering", "Board Games", "Dancing",
  "Meditation", "Sports", "Podcasts", "Languages",
] as const;

interface InterestPickerProps {
  onComplete?: () => void;
}

export default function InterestPicker({ onComplete }: InterestPickerProps) {
  const { data: savedInterests = [] } = useInterestsQuery();
  const mutation = useUpdateInterestsMutation();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (savedInterests.length > 0) {
      setSelected(savedInterests);
    }
  }, [savedInterests]);

  const toggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 8
          ? [...prev, interest]
          : prev
    );
  };

  const handleSave = () => {
    mutation.mutate(
      { interests: selected },
      { onSuccess: () => onComplete?.() }
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">
          What are you into?
        </h3>
        <p className="text-sm text-muted-foreground">
          Pick 3-8 interests. We&apos;ll match you with someone who shares them.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <motion.button
              key={interest}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(interest)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {interest}
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {selected.length} of 8 selected
        {selected.length < 3 && " — pick at least 3"}
      </p>

      <Button
        onClick={handleSave}
        disabled={selected.length < 3 || mutation.isPending}
        className="w-full rounded-xl"
        size="lg"
      >
        {mutation.isPending ? "Saving..." : "Save interests"}
      </Button>
    </div>
  );
}
