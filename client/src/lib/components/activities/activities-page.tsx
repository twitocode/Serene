"use client";

import { CalendarPlus, Heart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type FormEventHandler, useState } from "react";
import { ActivityCard } from "@/lib/components/activities/activity-card";
import { MoodScale } from "@/lib/components/activities/mood-scale";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/ui/select";
import { Textarea } from "@/lib/components/ui/textarea";
import { ACTIVITY_CATEGORIES } from "@/lib/data/activities-data";
import { getRandomSavoringPrompt } from "@/lib/data/savoring-prompts";
import { formatLocalDateKey } from "@/lib/helpers/get-current-date";
import {
	useActivitiesQuery,
	useCompleteActivityMutation,
	useCreateActivityMutation,
	useDeleteActivityMutation,
} from "@/lib/hooks/queries/use-activities";
import type { ActivityResponse } from "@/lib/types/api-types";

export default function ActivitiesPage() {
	const searchParams = useSearchParams();
	const today = new Date();
	const weekStart = new Date(today);
	weekStart.setDate(today.getDate() - today.getDay());
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 6);

	const fromStr = formatLocalDateKey(weekStart);
	const toStr = formatLocalDateKey(weekEnd);

	const { data: activities = [] } = useActivitiesQuery(fromStr, toStr);
	const createMutation = useCreateActivityMutation();
	const completeMutation = useCompleteActivityMutation();
	const deleteMutation = useDeleteActivityMutation();

	const [title, setTitle] = useState(() => searchParams.get("title") ?? "");
	const [category, setCategory] = useState(
		() => searchParams.get("category") ?? "",
	);
	const [date, setDate] = useState(
		() => searchParams.get("date") ?? today.toISOString().split("T")[0],
	);
	const [completingActivity, setCompletingActivity] =
		useState<ActivityResponse | null>(null);
	const [moodBefore, setMoodBefore] = useState<number | null>(null);
	const [moodAfter, setMoodAfter] = useState<number | null>(null);
	const [dialogStep, setDialogStep] = useState<"mood" | "savor">("mood");
	const [savoringPrompt, setSavoringPrompt] = useState("");
	const [savoringNote, setSavoringNote] = useState("");

	const handleCreate: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (!title.trim()) return;
		createMutation.mutate(
			{
				title: title.trim(),
				category: category || undefined,
				scheduledDate: date,
			},
			{
				onSuccess: () => {
					setTitle("");
					setCategory("");
				},
			},
		);
	};

	const resetDialog = () => {
		setCompletingActivity(null);
		setMoodBefore(null);
		setMoodAfter(null);
		setDialogStep("mood");
		setSavoringNote("");
		setSavoringPrompt("");
	};

	const handleComplete = () => {
		if (!completingActivity) return;
		completeMutation.mutate(
			{
				id: completingActivity.id,
				moodBefore: moodBefore ?? undefined,
				moodAfter: moodAfter ?? undefined,
			},
			{
				onSuccess: () => {
					setSavoringPrompt(getRandomSavoringPrompt());
					setDialogStep("savor");
				},
			},
		);
	};

	const pending = activities.filter((a) => !a.completed);
	const completed = activities.filter((a) => a.completed);

	const moodDiff =
		completed.length > 0
			? completed.reduce((sum, a) => {
					if (a.moodAfter != null && a.moodBefore != null) {
						return sum + (a.moodAfter - a.moodBefore);
					}
					return sum;
				}, 0) /
				Math.max(
					completed.filter((a) => a.moodAfter != null && a.moodBefore != null)
						.length,
					1,
				)
			: null;

	return (
		<div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 pb-12 pt-6 md:px-6">
			<motion.header
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8 text-center"
			>
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
					Move &amp; do
				</p>
				<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
					Activities
				</h1>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					Schedule pleasant activities. Small actions shift big moods.
				</p>
			</motion.header>

			<motion.section
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.05 }}
				className="mb-8"
			>
				<Card className="border-border/80 bg-card/95 shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 font-serif text-lg">
							<CalendarPlus className="size-5 text-primary" />
							Schedule an activity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleCreate} className="flex flex-col gap-3">
							<Input
								placeholder="e.g. Walk in the park, Call a friend…"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="h-11 rounded-xl"
							/>
							<div className="grid grid-cols-2 gap-3">
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger className="h-11 rounded-xl">
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										{ACTIVITY_CATEGORIES.map((c) => (
											<SelectItem key={c.category} value={c.category}>
												{c.category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="h-11 rounded-xl"
								/>
							</div>
							<Button
								type="submit"
								className="h-11 rounded-xl"
								disabled={!title.trim() || createMutation.isPending}
							>
								{createMutation.isPending ? "Adding..." : "Add activity"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.section>

			{moodDiff !== null && completed.length > 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
				>
					<Sparkles className="size-5 text-primary" />
					<p className="text-sm text-foreground">
						This week, activities shifted your mood by{" "}
						<span className="font-semibold text-primary">
							{moodDiff >= 0 ? "+" : ""}
							{moodDiff.toFixed(1)}
						</span>{" "}
						on average.
					</p>
				</motion.div>
			)}

			{pending.length > 0 && (
				<section className="mb-8">
					<h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Planned
					</h3>
					<div className="flex flex-col gap-3">
						{pending.map((activity) => (
							<ActivityCard
								key={activity.id}
								activity={activity}
								onComplete={() => setCompletingActivity(activity)}
								onDelete={() => deleteMutation.mutate(activity.id)}
							/>
						))}
					</div>
				</section>
			)}

			{completed.length > 0 && (
				<section>
					<h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Completed
					</h3>
					<div className="flex flex-col gap-3">
						{completed.map((activity) => (
							<ActivityCard key={activity.id} activity={activity} />
						))}
					</div>
				</section>
			)}

			{activities.length === 0 && (
				<p className="mt-8 text-center text-sm text-muted-foreground">
					No activities this week yet. Add one above to get started.
				</p>
			)}

			<Dialog
				open={completingActivity !== null}
				onOpenChange={(open) => {
					if (!open) resetDialog();
				}}
			>
				<DialogContent className="sm:max-w-md">
					<AnimatePresence mode="wait">
						{dialogStep === "mood" ? (
							<motion.div
								key="mood"
								initial={{ opacity: 0, x: 0 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
							>
								<DialogHeader>
									<DialogTitle className="font-serif">
										How did it go?
									</DialogTitle>
									<DialogDescription>
										Rate your mood before and after &ldquo;
										{completingActivity?.title}&rdquo;
									</DialogDescription>
								</DialogHeader>

								<div className="space-y-4 py-2">
									<div className="space-y-2">
										<p className="text-sm font-medium text-foreground">
											Mood before
										</p>
										<MoodScale value={moodBefore} onChange={setMoodBefore} />
									</div>
									<div className="space-y-2">
										<p className="text-sm font-medium text-foreground">
											Mood after
										</p>
										<MoodScale value={moodAfter} onChange={setMoodAfter} />
									</div>
								</div>

								<DialogFooter className="gap-2 sm:gap-0">
									<Button
										variant="ghost"
										onClick={() => {
											if (!completingActivity) return;
											completeMutation.mutate(
												{ id: completingActivity.id },
												{
													onSuccess: () => {
														setSavoringPrompt(getRandomSavoringPrompt());
														setDialogStep("savor");
													},
												},
											);
										}}
									>
										Skip rating
									</Button>
									<Button
										onClick={handleComplete}
										disabled={completeMutation.isPending}
									>
										{completeMutation.isPending ? "Saving..." : "Save"}
									</Button>
								</DialogFooter>
							</motion.div>
						) : (
							<motion.div
								key="savor"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
							>
								<DialogHeader>
									<div className="flex items-center gap-2">
										<Heart className="size-5 text-pink-500" />
										<DialogTitle className="font-serif">
											Savor this moment
										</DialogTitle>
									</div>
									<DialogDescription className="pt-1">
										{savoringPrompt}
									</DialogDescription>
								</DialogHeader>

								<div className="py-3">
									<Textarea
										placeholder="Jot something down (optional)…"
										value={savoringNote}
										onChange={(e) => setSavoringNote(e.target.value)}
										className="min-h-[80px] resize-y rounded-xl"
										rows={3}
									/>
								</div>

								<DialogFooter>
									<Button onClick={resetDialog} className="w-full rounded-xl">
										Done
									</Button>
								</DialogFooter>
							</motion.div>
						)}
					</AnimatePresence>
				</DialogContent>
			</Dialog>
		</div>
	);
}
