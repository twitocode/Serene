import { Brain, CloudLightning, Heart, Shield } from "lucide-react";
import type { FormEventHandler } from "react";
import MoodPicker from "@/lib/components/checkin/mood-picker";
import { MochiDefault as Mochi } from "@/lib/components/common/mochi";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-bottom";

export default function MoodStep() {
	const { goNext, selectedMood } = useCheckinStore((s) => s);
	const [scrollRef, scrollToBottom] = useScrollToBottom<HTMLFormElement>();

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (selectedMood != null) {
			goNext();
		}
	};

	return (
		<form
			onSubmit={onSubmit}
			className="mx-auto flex w-full flex-col gap-6 pb-8 md:gap-8"
			ref={scrollRef}
		>
			<div className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm md:p-7">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
					<div className="flex justify-center sm:justify-start">
						<div className="rounded-2xl bg-primary/8 p-4 ring-1 ring-primary/15">
							<Mochi className="size-28 sm:size-32" />
						</div>
					</div>
					<div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
							Step 1 of 5
						</p>
						<h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
							How are you right now?
						</h1>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Choose a single word that fits you best. Look through vibe,
							energy, mental, or status, then tap one option. You can change
							your mind before continuing.
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:gap-5">
				<MoodPicker scrollToBottom={scrollToBottom} type="vibe" Icon={Heart} />
				<MoodPicker
					scrollToBottom={scrollToBottom}
					type="energy"
					Icon={CloudLightning}
				/>
				<MoodPicker
					scrollToBottom={scrollToBottom}
					type="mental"
					Icon={Brain}
				/>
				<MoodPicker
					scrollToBottom={scrollToBottom}
					type="status"
					Icon={Shield}
				/>
			</div>

			<div className="sticky bottom-0 -mx-4 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-none">
				<Button
					type="submit"
					size="lg"
					className="btn-playful h-12 w-full rounded-xl text-base font-semibold md:max-w-sm "
					disabled={selectedMood === null}
				>
					Continue
				</Button>
			</div>
		</form>
	);
}
