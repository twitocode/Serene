"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { Button } from "@/lib/components/ui/button";

interface YearSelectorProps {
	year: number;
	onYearChange: (year: number) => void;
}

export function YearSelector({ year, onYearChange }: YearSelectorProps) {
	const currentYear = new Date().getFullYear();

	return (
		<div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
			<Button
				variant="outline"
				size="icon"
				className="size-10 shrink-0 rounded-xl border-border/80"
				onClick={() => onYearChange(year - 1)}
				aria-label="Previous year"
			>
				<ArrowLeft2 variant="Outline" size={16} color="currentColor" />
			</Button>
			<div className="min-w-0 flex-1 text-center">
				<p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Viewing year
				</p>
				<p className="font-serif text-2xl font-semibold tabular-nums text-foreground">
					{year}
				</p>
				<p className="text-xs text-muted-foreground">
					{year === currentYear
						? "Including recent check-ins"
						: "Historical data"}
				</p>
			</div>
			<Button
				variant="outline"
				size="icon"
				className="size-10 shrink-0 rounded-xl border-border/80"
				onClick={() => onYearChange(year + 1)}
				disabled={year >= currentYear}
				aria-label="Next year"
			>
				<ArrowRight2 variant="Bulk" size={16} color="currentColor" />
			</Button>
		</div>
	);
}
