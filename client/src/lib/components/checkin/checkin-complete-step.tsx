import {
	Activity,
	Flash,
	Health,
	Heart,
	MessageCircle,
	Shield,
} from "iconsax-reactjs";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { getMoodTypeColour, getSeverityColor } from "@/lib/data/moods";
import { useCompleteCheckinMutation } from "@/lib/hooks/queries/use-checkins";

export default function CheckinCompleteStep() {
	const {
		somaticState,
		selectedMood,
		lingeringThoughts,
		reframedThought,
		goBack,
		complete: resetStore,
		displayDate,
	} = useCheckinStore((s) => s);

	const completeCheckinMutation = useCompleteCheckinMutation(displayDate);

	const complete = async () => {
		try {
			if (!selectedMood) return;
			await completeCheckinMutation.mutateAsync({
				lingeringThoughts,
				reframedThought,
				moodLabel: selectedMood.label,
				moodSeverity: selectedMood.severity,
				somaticState,
			});
			resetStore();
		} catch (err) {
			console.error(err);
		}
	};

	const MoodIcon = selectedMood
		? {
				vibe: Heart,
				energy: Flash,
				mental: Health,
				status: Shield,
			}[selectedMood.type]
		: null;

	const severityClass = selectedMood
		? getSeverityColor(selectedMood.severity)
		: "";

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-10 self-center">
			<div className="space-y-2 text-center">
				<p className="text-xs font-semibold uppercase tracking-widest text-primary">
					Step 5 of 5
				</p>
				<h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
					Review & save
				</h1>
				<p className="text-sm text-muted-foreground">
					Take a moment to read what you shared. Then finish when you&apos;re
					ready.
				</p>
			</div>

			<Card className="border-border/80 bg-card/95 shadow-sm">
				<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
					<div className="space-y-1">
						<CardTitle className="font-serif text-lg">Mood</CardTitle>
						<CardDescription>Your chosen label</CardDescription>
					</div>
					{MoodIcon ? (
						<MoodIcon
							variant="Bulk"
							size={28}
							color={getMoodTypeColour(selectedMood!.type)}
						/>
					) : null}
				</CardHeader>
				<CardContent>
					<Badge
						variant="outline"
						className={`text-sm font-medium ${severityClass}`}
					>
						{selectedMood?.label}
					</Badge>
				</CardContent>
			</Card>

			{lingeringThoughts || reframedThought ? (
				<Card className="border-border/80 bg-card/95 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 font-serif text-lg">
							<span className="size-5 flex items-center justify-center">
								<MessageCircle variant="Bulk" size={20} color="currentColor" />
							</span>
							Thoughts &amp; reframe
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{lingeringThoughts ? (
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									What&apos;s weighing on you
								</p>
								<p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">
									{lingeringThoughts}
								</p>
							</div>
						) : null}
						{reframedThought ? (
							<>
								{lingeringThoughts ? (
									<Separator className="bg-border/60" />
								) : null}
								<div className="space-y-2">
									<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										A kinder angle
									</p>
									<p className="whitespace-pre-wrap text-sm leading-relaxed text-primary md:text-base">
										{reframedThought}
									</p>
								</div>
							</>
						) : null}
					</CardContent>
				</Card>
			) : null}

			<Card className="border-border/80 bg-card/95 shadow-sm">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center gap-2 font-serif text-lg">
						<span className="size-5 flex items-center justify-center">
							<Activity variant="Bulk" size={20} color="currentColor" />
						</span>
						Body check-in
					</CardTitle>
					<CardDescription>
						From your somatic step, shown here for your review only.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{Object.keys(somaticState).length > 0 ? (
						<div className="flex flex-col gap-3">
							{Object.entries(somaticState).map(([part, data]) => (
								<div key={part} className="flex flex-col gap-1.5">
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
							))}
						</div>
					) : (
						<p className="text-sm italic text-muted-foreground">
							No body sensations recorded this time.
						</p>
					)}
				</CardContent>
			</Card>

			<div className="flex flex-col gap-3 pt-6 sm:flex-row shrink-0 mt-4 pb-8">
				<Button
					variant="outline"
					size="lg"
					className="min-h-14 flex-1 rounded-xl shrink-0 text-lg"
					onClick={goBack}
					type="button"
				>
					Back
				</Button>
				<Button
					size="lg"
					className="min-h-14 flex-1 rounded-xl shrink-0 text-lg"
					onClick={complete}
					disabled={completeCheckinMutation.isPending}
					type="button"
				>
					{completeCheckinMutation.isPending ? "Saving…" : "Finish check-in"}
				</Button>
			</div>
		</div>
	);
}
