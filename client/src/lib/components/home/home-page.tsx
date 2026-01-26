"use client";

import { MochiDefault, MochiHappy } from "@/lib/components/common/mochi";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { motion } from "framer-motion";
import { Flame, Flower2, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const suggestions = [
  { id: "1", icon: MochiDefault, title: "Talk to Mochi" },
  { id: "2", icon: Flower2, title: "Daily Affirmations" },
  { id: "3", icon: Square, title: "Box Breathing" },
];

export default function HomePage() {
  const router = useRouter();
  const { startCheckin } = useCheckinStore((s) => s);
  const { data: user } = useUserQuery();

  const handleStartCheckin = () => {
    startCheckin();
    router.push("/home/checkin");
  };

  return (
    <div className="min-h-full max-w-2xl mx-auto flex flex-col gap-8  p-4">
      <div className="flex flex-col items-center gap-6 mt-4">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex-1" />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-semibold font-serif"
          >
            good morning
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-md"
          >
            <Flame className="w-5 h-5" fill="currentColor" />
            <span className="font-bold text-lg">
              {user?.profile?.currentStreak || 0} Days
            </span>
          </motion.div>
        </div>
      </div>
      <DateScroll readOnly />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gray-200 border-[1.5px] p-8 flex items-center justify-between "
      >
       <MochiHappy className="h-40 w-40"/>

        <div className="flex flex-col gap-4 items-start max-w-xs">
          <h2 className="text-3xl font-bold leading-tight text-black">
            Stressed for exams?
          </h2>
          <Button
            onClick={handleStartCheckin}
            className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-base font-medium hover:scale-105 transition active:scale-105"
          >
            Talk about it
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-medium"
        >
          Suggested Actions
        </motion.h3>

        <div className="grid grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            const link = `/home/explore/${suggestion.id}`;

            return (
              <Link
                href={link}
                key={suggestion.id}
                className="hover:scale-105 transition active:scale-105 hover:rotate-3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-purple-200  border  p-6 flex flex-col items-center text-center gap-3"
                >
                  <Icon
                    className="w-16 h-16 text-black fill-current"
                    strokeWidth={1.5}
                  />
                  <span className="text-lg font-bold leading-tight text-black">
                    {suggestion.title}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
