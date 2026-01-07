import { Button } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  useEffect(() => {
    if (value) {
      setInternalDate(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate);
    if (selectedDate) {
      onChange(selectedDate.toISOString().split("T")[0]);
    }
    setOpen(false);
    onBlur();
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && value) {
      setInternalDate(new Date(value));
    }
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
          <span className={internalDate ? "" : "text-muted-foreground"}>
            {formatDisplayDate(internalDate)}
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={internalDate}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
