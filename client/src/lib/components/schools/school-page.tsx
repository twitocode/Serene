"use client"

import { motion } from "motion/react";

export default function SchoolPage() {
  return (
    <div className="min-h-full max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-semibold text-center font-serif mb-2">
          Your School
        </h1>
        <p className="text-center text-muted-foreground">
          Find mental health resources pertaining to SCHOOL
        </p>
      </motion.div>

    </div>
  );
}
