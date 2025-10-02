"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/lib/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateFormatter, DateValue, getLocalTimeZone } from "@internationalized/date";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export function DatePicker({ value = "", onChange }: Props) {
  const [date, setDate] = React.useState<DateValue | null>(null);
  const df = new DateFormatter("en-US", { dateStyle: "long" });

  // Keep parent prop in sync
  React.useEffect(() => {
    if (date && onChange) {
      onChange(date.toString());
    }
  }, [date, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}