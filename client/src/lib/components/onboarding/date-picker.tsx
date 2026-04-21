import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/lib/components/ui/button";
import { Calendar } from "@/lib/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/lib/components/ui/popover";

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
	const displayDate = value
		? new Date(
				new Date(value).getUTCFullYear(),
				new Date(value).getUTCMonth(),
				new Date(value).getUTCDate(),
			)
		: undefined;

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			const year = selectedDate.getFullYear();
			const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
			const day = String(selectedDate.getDate()).padStart(2, "0");
			onChange(`${year}-${month}-${day}`);
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
					className="w-full justify-between font-normal bg-white border border-border shadow-sm focus-visible:ring-primary/20 transition-all duration-200"
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
