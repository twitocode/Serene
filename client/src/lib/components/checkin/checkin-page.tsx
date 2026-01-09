"use client";

import CheckinFlow from "@/lib/components/checkin/checkin-flow";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useCheckinsQuery } from "@/lib/hooks/queries/use-checkins";
import { Smile } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const initialStart = searchParams.get("start");

  useEffect(() => {
    if (initialStart == "true") {
      toggleIsCheckingIn();
    }
  }, [initialStart]);

  const { displayDate, toggleIsCheckingIn, isCheckingIn } = useCheckinStore(
    (s) => s
  );
  const { data: checkins } = useCheckinsQuery(displayDate);

  const onStartCheckin = () => {
    toggleIsCheckingIn();
  };

  return initialStart === "true" || isCheckingIn ? (
    <CheckinFlow />
  ) : (
    <div className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold text-center mt-4 font-serif"
      >
        Checkin
      </motion.h1>
      <DateScroll />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="border-[1.5px] p-8 flex items-center justify-between"
      >
        {checkins?.length == 0 ? (
          <>
            <Smile
              className="w-32 h-32 text-primary  fill-current"
              strokeWidth={1.5}
            />

            <div className="flex flex-col gap-4 items-start max-w-xs">
              <>
                <h2 className="text-xl lg:text-3xl font-bold leading-tight text-secondary-foreground">
                  Time to check in for the day
                </h2>
                <Button
                  className="bg-primary text-primary-foreground  px-6 py-2 text-base font-medium hover:scale-105 transition active:scale-105"
                  onClick={onStartCheckin}
                >
                  Talk about it
                </Button>
              </>
            </div>
          </>
        ) : (
          <>
            <Smile
              className="w-32 h-32 text-black  fill-current"
              strokeWidth={1.5}
            />

            <div className="flex flex-col gap-4 items-start max-w-xs">
              <>
                <h2 className="text-xl lg:text-3xl font-bold leading-tight text-black">
                  Feeling something again?
                </h2>
                <Button
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-base font-medium hover:scale-105 transition active:scale-105"
                  onClick={onStartCheckin}
                >
                  Checkin now
                </Button>
              </>
            </div>
          </>
        )}
      </motion.div>
      <div className="gap-4 flex flex-col">
        {checkins
          ?.sort(
            (a, b) =>
              Number(new Date(b.dateCompleted)) -
              Number(new Date(a.dateCompleted))
          )
          .map((checkin) => {
            const formattedDate = new Intl.DateTimeFormat(
              navigator.language
            ).format(new Date(checkin.dateCompleted.split("T")[0]));

            return (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="border flex flex-col p-4 hover:scale-105 transition ease-in-out"
              >
                <p className="text-muted-foreground">{formattedDate}</p>
                {checkin.moodLabel}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
