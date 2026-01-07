import { Button } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export function OnboardingDatePicker({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const [open, setOpen] = useState(false);
  const displayDate = value ? new Date(value) : undefined;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate.toISOString().split("T")[0]);
    }
    setOpen(false);
    onBlur();
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "Select date of birth";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal bg-gray-100 border-0"
        >
          <span className={displayDate ? "" : "text-muted-foreground"}>
            {formatDisplayDate(displayDate)}
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          defaultMonth={displayDate}
          //@ts-ignore
          defaultYear={displayDate?.getFullYear()}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          max={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}