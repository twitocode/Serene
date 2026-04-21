import type { FormEventHandler } from "react";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Textarea } from "@/lib/components/ui/textarea";
import { useUserQuery } from "@/lib/hooks/queries/use-user";

export default function WeighingStep() {
	const { goBack, goNext, lingeringThoughts, setLingeringThoughts } =
		useCheckinStore((s) => s);

	const { data: user } = useUserQuery();
	const mochiName = user?.profile?.mochiName || "Mochi";

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		goNext();
	};

	return (
		<form
			onSubmit={onSubmit}
			className="mx-auto flex w-full max-w-xl flex-col gap-8 pb-8"
		>
			<div className="space-y-3 text-center">
				<p className="text-xs font-semibold uppercase tracking-widest text-primary">
					Step 3 of 5
				</p>
				<h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
					What&apos;s weighing on you?
				</h1>
				<p className="text-sm text-muted-foreground">
					Describe the situation and the thought that keeps coming back. This
					helps {mochiName} understand what to work with in the next step.
				</p>
			</div>

			<Textarea
				placeholder="e.g. I have an exam tomorrow and I keep thinking I'm going to fail no matter how much I study…"
				id="weighing"
				className="min-h-[180px] resize-y rounded-xl border-border/80 bg-card text-base leading-relaxed"
				rows={8}
				value={lingeringThoughts || ""}
				onChange={(e) => setLingeringThoughts(e.target.value)}
			/>

			<ButtonGroup className="grid w-full grid-cols-2 gap-3">
				<Button
					onClick={goBack}
					type="button"
					size="lg"
					variant="outline"
					className="h-12 rounded-xl"
				>
					Back
				</Button>
				<Button type="submit" size="lg" className="h-12 rounded-xl">
					Next
				</Button>
			</ButtonGroup>
		</form>
	);
}
