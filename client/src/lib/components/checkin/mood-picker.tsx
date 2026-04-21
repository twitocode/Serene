import { TickCircle } from "iconsax-reactjs";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { getMoodTypeColour, MOODS, type MoodType } from "@/lib/data/moods";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Props {
	Icon: React.ComponentType<{ color?: string; variant?: string; size?: number }>;
	type: MoodType;
	scrollToBottom: () => void;
}

const CATEGORY_LABEL: Record<MoodType, string> = {
	vibe: "Vibe",
	energy: "Energy",
	mental: "Mental",
	status: "Status",
};

const TYPE_SHELL: Record<
	MoodType,
	{ iconBg: string; iconRing: string; labelClass: string }
> = {
	vibe: {
		iconBg: "bg-red-500/12",
		iconRing: "ring-red-500/25",
		labelClass: "text-red-700 dark:text-red-300",
	},
	energy: {
		iconBg: "bg-amber-400/15",
		iconRing: "ring-amber-400/30",
		labelClass: "text-amber-800 dark:text-amber-200",
	},
	mental: {
		iconBg: "bg-violet-500/12",
		iconRing: "ring-violet-500/25",
		labelClass: "text-violet-800 dark:text-violet-200",
	},
	status: {
		iconBg: "bg-teal-500/12",
		iconRing: "ring-teal-500/25",
		labelClass: "text-teal-800 dark:text-teal-200",
	},
};

export default function MoodPicker({ type, Icon, scrollToBottom }: Props) {
	const { selectedMood, setSelectedMood } = useCheckinStore((s) => s);
	const isMobile = useIsMobile();
	const shell = TYPE_SHELL[type];
	const options = MOODS.filter((x) => x.type === type);
	const rowActive = selectedMood != null && selectedMood.type === type;

	return (
		<section
			className={cn(
				"rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-5",
				rowActive
					? "border-primary/50 ring-2 ring-primary/20"
					: "border-border/80",
			)}
			aria-label={`${CATEGORY_LABEL[type]} options`}
		>
			<div className="mb-4 flex items-center gap-3">
				<div
					className={cn(
						"flex size-11 shrink-0 items-center justify-center rounded-xl ring-2",
						shell.iconBg,
						shell.iconRing,
					)}
				>
					<Icon color={getMoodTypeColour(type)} variant="Bulk" size={22} />
				</div>
				<div className="min-w-0">
					<h2
						className={cn(
							"text-base font-semibold tracking-tight md:text-lg",
							shell.labelClass,
						)}
					>
						{CATEGORY_LABEL[type]}
					</h2>
					<p className="text-xs text-muted-foreground">Tap one option below.</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{options.map((x) => {
					const isSelected = selectedMood?.label === x.label;
					return (
						<button
							key={x.label}
							type="button"
							role="radio"
							aria-checked={isSelected}
							className={cn(
								"flex min-h-[3rem] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-center text-sm font-medium transition-all",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "border-primary bg-primary text-primary-foreground shadow-md"
									: "border-border/70 bg-muted/30 text-foreground hover:border-primary/40 hover:bg-accent/40",
							)}
							onClick={() => {
								setSelectedMood(x);
								if (isMobile) scrollToBottom();
							}}
						>
							{isSelected ? (
								<span className="size-4 shrink-0" aria-hidden>
									<TickCircle variant="Bulk" size={16} color="currentColor" />
								</span>
							) : null}
							<span>{x.label}</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}
