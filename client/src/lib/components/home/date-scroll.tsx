import { useEffect, useMemo, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/lib/components/ui/carousel";
import { formatLocalDateKey } from "@/lib/helpers/get-current-date";
import { cn } from "@/lib/utils";

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
	readOnly?: boolean;
}

export default function DateScroll({
	selectedDate,
	changeSelectedDate,
	date,
	readOnly = false,
}: Props) {
	const calendarDays = useMemo(() => getCalendarDays(30, date), [date]);
	const todayString = new Date().toDateString();

	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;

		const selectedIndex = calendarDays.findIndex(
			(item) => formatLocalDateKey(item.fullDate) === selectedDate,
		);

		const targetIndex =
			selectedIndex !== -1 ? selectedIndex : calendarDays.length - 1;

		api.scrollTo(targetIndex);
	}, [api, selectedDate, calendarDays]);

	return (
		<Carousel
			setApi={setApi}
			opts={{
				align: "center",
				dragFree: true,
				containScroll: "trimSnaps",
			}}
			className="w-full"
		>
			<CarouselContent className="-ml-2 p-1">
				{" "}
				{/* p-1 allows shadows to breathe */}
				{calendarDays.map((item) => {
					const isToday = item.fullDate.toDateString() === todayString;
					const isSelected = selectedDate === formatLocalDateKey(item.fullDate);

					return (
						<CarouselItem
							key={formatLocalDateKey(item.fullDate)}
							className="pl-2 basis-auto"
						>
							<button
								type="button"
								disabled={readOnly}
								className={cn(
									"flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all border-[1.5px] select-none",
									{
										"bg-primary text-primary-foreground shadow-lg border-primary scale-105":
											isSelected,

										"border-primary text-primary font-bold":
											isToday && !isSelected,

										"border-transparent hover:bg-muted/50 cursor-pointer":
											!isSelected && !isToday && !readOnly,

										"cursor-default border-transparent opacity-80":
											readOnly && !isSelected && !isToday,
									},
								)}
								onClick={() =>
									!readOnly &&
									changeSelectedDate?.(formatLocalDateKey(item.fullDate))
								}
							>
								<span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 leading-none mb-1">
									{item.day}
								</span>
								<span className="text-xl font-bold leading-none">
									{item.date}
								</span>
							</button>
						</CarouselItem>
					);
				})}
			</CarouselContent>
		</Carousel>
	);
}
