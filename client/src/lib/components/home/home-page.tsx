"use client";

import DateScroll from "@/lib/components/home/date-scroll";
import { Button } from "@/lib/components/ui/button";
import { motion } from "framer-motion";
import { Flower2, Smile, Square } from "lucide-react";
import Link from "next/link";



const suggestions = [
  { id: "1", icon: Smile, title: "Talk to Koala" },
  { id: "2", icon: Flower2, title: "Daily Affirmations" },
  { id: "3", icon: Square, title: "Box Breathing" },
];

// --- Main Page Component ---
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header & Calendar */}
      <div className="flex flex-col items-center gap-6 mt-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold"
        >
          good morning
        </motion.h1>

        <DateScroll />
      </div>

      {/* Main Card (Stressed for exams?) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-gray-200 rounded-3xl p-8 flex items-center justify-between "
      >
        {/* Koala Placeholder Icon */}
        <Smile
          className="w-32 h-32 text-black fill-current"
          strokeWidth={1.5}
        />

        <div className="flex flex-col gap-4 items-start max-w-xs">
          <h2 className="text-3xl font-bold leading-tight">
            Stressed for exams?
          </h2>
          <Link href="/home/checkin">
            <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full text-base font-medium hover:scale-105 transition active:scale-105">
              Talk about it
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Suggested Actions Section */}
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
                className="hover:scale-105 transition active:scale-105"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-purple-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3"
                >
                  <Icon
                    className="w-16 h-16 text-black fill-current"
                    strokeWidth={1.5}
                  />
                  <span className="text-lg font-bold leading-tight">
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
