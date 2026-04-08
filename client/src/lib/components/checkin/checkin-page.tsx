"use client";

import { isToday } from "date-fns";
import { Activity, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import CheckinFlow from "@/lib/components/checkin/checkin-flow";
import { MochiDefault } from "@/lib/components/common/mochi";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Separator } from "@/lib/components/ui/separator";
import {
	getMoodFromLabel,
	getSeverityColor,
	type MoodLabel,
} from "@/lib/data/moods";
import { useCheckinsQuery } from "@/lib/hooks/queries/use-checkins";
import { cn } from "@/lib/utils";

export default function CheckinPage() {
	const { displayDate, startCheckin, isCheckingIn, changeDate, cancel } =
		useCheckinStore((s) => s);

	useEffect(() => {
		return () => {
			cancel();
		};
	}, [cancel]);

	const { data: checkins } = useCheckinsQuery(displayDate);

	const onStartCheckin = () => {
		startCheckin();
	};

	return isCheckingIn ? (
		<CheckinFlow />
	) : (
		<div className="mx-auto flex min-h-full max-w-2xl flex-col gap-8 px-4 py-6 md:py-8">
			<motion.header
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center"
			>
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
					Daily rhythm
				</p>
				<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
					Check-in
				</h1>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					Pick a day, reflect, and leave when you&apos;re ready.
				</p>
			</motion.header>

			<DateScroll selectedDate={displayDate} changeSelectedDate={changeDate} />

			<motion.section
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, delay: 0.05 }}
				className="card-organic relative overflow-hidden border-border/80 bg-card p-6 shadow-md md:p-8"
			>
				<div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex justify-center md:justify-start">
						<MochiDefault className="size-36 md:size-40" />
					</div>
					<div className="flex max-w-md flex-col items-center gap-4 text-center md:items-start md:text-left">
						<h2 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
							{!isToday(displayDate)
								? checkins && checkins.length > 0
									? "Want to make another check-in for this date?"
									: "Forgot to make a check-in this day?"
								: checkins && checkins.length > 0
									? "Want to make another check-in?"
									: "Feeling down? How about checking in?"}
						</h2>
						<Button
							size="lg"
							className="btn-playful w-full sm:w-auto"
							onClick={onStartCheckin}
						>
							{checkins && checkins.length > 0
								? "Check in again"
								: isToday(displayDate)
									? "Start check-in"
									: "Add check-in"}
						</Button>
					</div>
				</div>
			</motion.section>

			<div className="flex flex-col gap-3">
				<h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
					Logged this day
				</h3>
				{checkins && checkins.length > 0 ? (
					checkins
						.sort(
							(a, b) =>
								Number(new Date(b.dateCompleted)) -
								Number(new Date(a.dateCompleted)),
						)
						.map((checkin) => {
							const formattedDate = new Intl.DateTimeFormat(
								navigator.language,
								{
									dateStyle: "medium",
									timeStyle: "short",
								},
							).format(new Date(checkin.dateCompleted));

							const checkinMood = getMoodFromLabel(
								checkin.moodLabel as MoodLabel,
							);
							const severityClass = checkinMood
								? getSeverityColor(checkinMood.severity)
								: "";

							return (
								<Dialog key={checkin.id}>
									<DialogTrigger asChild>
										<motion.div
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.35 }}
											className="card-organic flex cursor-pointer flex-col justify-between gap-3 border-border/80 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
										>
											<p
												className="text-sm text-muted-foreground"
												suppressHydrationWarning
											>
												{formattedDate}
											</p>
											<Badge
												variant="outline"
												className={cn(
													"w-fit text-sm font-medium tabular-nums",
													severityClass,
												)}
											>
												{checkin.moodLabel}
											</Badge>
										</motion.div>
									</DialogTrigger>
									<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
										<DialogHeader>
											<DialogTitle className="font-serif text-xl">
												Check-in Details
											</DialogTitle>
											<DialogDescription suppressHydrationWarning>
												{formattedDate}
											</DialogDescription>
										</DialogHeader>
										<div className="flex flex-col gap-5 py-4">
											<div className="flex items-center gap-3">
												<span className="text-sm font-medium text-muted-foreground">
													Mood:
												</span>
												<Badge
													variant="outline"
													className={cn("text-sm font-medium", severityClass)}
												>
													{checkin.moodLabel}
												</Badge>
											</div>

											{(checkin.lingeringThoughts ||
												checkin.reframedThought) && (
												<div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
													<h4 className="flex items-center gap-2 font-serif text-base font-medium">
														<MessageCircle className="size-4 text-primary" />
														Thoughts &amp; reframe
													</h4>
													{checkin.lingeringThoughts && (
														<div className="space-y-1.5">
															<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
																What weighed on you
															</p>
															<p className="whitespace-pre-wrap text-sm leading-relaxed">
																{checkin.lingeringThoughts}
															</p>
														</div>
													)}
													{checkin.lingeringThoughts &&
														checkin.reframedThought && (
															<Separator className="bg-border/60" />
														)}
													{checkin.reframedThought && (
														<div className="space-y-1.5">
															<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
																A kinder angle
															</p>
															<p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
																{checkin.reframedThought}
															</p>
														</div>
													)}
												</div>
											)}

											{checkin.somaticState &&
												Object.keys(checkin.somaticState).length > 0 && (
													<div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
														<h4 className="flex items-center gap-2 font-serif text-base font-medium">
															<Activity className="size-4 text-primary" />
															Body check-in
														</h4>
														<div className="flex flex-col gap-3">
															{Object.entries(checkin.somaticState).map(
																([part, data]) => (
																	<div
																		key={part}
																		className="flex flex-col gap-1.5"
																	>
																		<span className="text-sm font-medium capitalize text-foreground">
																			{part}
																		</span>
																		<div className="flex flex-wrap gap-1.5">
																			{data.sensations.map((s) => (
																				<Badge
																					key={s}
																					variant="secondary"
																					className="font-normal"
																				>
																					{s}
																				</Badge>
																			))}
																		</div>
																	</div>
																),
															)}
														</div>
													</div>
												)}
										</div>
									</DialogContent>
								</Dialog>
							);
						})
				) : (
					<p className="rounded-2xl border border-dashed border-border/80 bg-muted/15 py-8 text-center text-sm text-muted-foreground">
						No check-ins for this date yet.
					</p>
				)}
			</div>
		</div>
	);
}
