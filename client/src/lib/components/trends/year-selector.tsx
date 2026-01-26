"use client";

import { Button } from "@/lib/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ year, onYearChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex items-center justify-center gap-4 py-4 border-t border-border bg-card/50">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year - 1)}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <div className="text-xs text-muted-foreground">{year}</div>
        <div className="font-medium">
          {year === currentYear ? "This year" : `Year ${year}`}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year + 1)}
        disabled={year >= currentYear}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
