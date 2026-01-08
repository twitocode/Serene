import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getCalendarDays = (daysCount: number = 7, fromDate?: Date) => {
  const days = [];
  const now = fromDate || new Date();

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(now);
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

interface Props {
  selectedDate?: string;
  changeSelectedDate?: (date: string) => void;
  date?: Date;
}

export default function DateScroll({ selectedDate, changeSelectedDate, date }: Props) {
  const calendarDays = useMemo(() => getCalendarDays(7, date), [date]);
  const today = new Date().getDate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={`grid grid-cols-7 gap-6 text-center`}
    >
      {calendarDays.map((item) => {
        const isToday = item.fullDate.getDate() === today;
        const isSelected = selectedDate === item.fullDate.toISOString().split('T')[0];
        return (
          <button
            type="button"
            key={item.fullDate.toISOString()}
            className={cn("flex flex-col items-center p-4", {
              "bg-secondary text-secondary-foreground border": isToday,
              "bg-primary text-primary-foreground": isSelected,
            })}
            onClick={() => changeSelectedDate?.(item.fullDate.toISOString().split('T')[0])}
          >
            <span className="text-gray-500 text-sm font-medium">
              {item.day}
            </span>
            <span className="text-lg font-semibold">{item.date}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
