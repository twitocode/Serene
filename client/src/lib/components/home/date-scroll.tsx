import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getCalendarDays = (daysCount: number = 7) => {
  const days = [];
  const now = new Date();

  for (let i = 0; i < daysCount; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    days.push({
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" })
        .format(date)
        .slice(0, 2),
      date: date.getDate().toString(),
      fullDate: date,
    });
  }
  return days.reverse();
};

export default function DateScroll() {
  const calendarDays = useMemo(() => getCalendarDays(7), []);
  const currentDate = useState(calendarDays[-1]);
  const today = new Date().getDate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={`grid grid-cols-7 gap-6 text-center`}
    >
      {calendarDays.map((item, index) => {
        const isToday = item.fullDate.getDate() === today;
        return (
          <div
            key={index}
            className={cn("flex flex-col items-center p-4", {
              "bg-secondary text-secondary-foreground rounded-md": isToday,
            })}
          >
            <span className="text-gray-500 text-sm font-medium">
              {item.day}
            </span>
            <span className="text-lg font-semibold">{item.date}</span>
          </div>
        );
      })}
    </motion.div>
  );
}
