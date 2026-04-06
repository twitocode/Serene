import { Lightbulb, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { type FormEventHandler, useEffect, useRef } from "react";
import { MochiDefault } from "@/lib/components/common/mochi";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import { Textarea } from "@/lib/components/ui/textarea";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import type { ReframeResponse } from "@/lib/types/api-types";
import { useReframeMutation } from "@/lib/hooks/queries/use-reframe";

export default function ReframingStep() {
	const {
		goBack,
		goNext,
		reframedThought,
		setReframedThought,
		lingeringThoughts,
	} = useCheckinStore((s) => s);

	const { data: user } = useUserQuery();
	const mochiName = user?.profile?.mochiName || "Mochi";

	const { mutate, data, isPending, isError, error } = useReframeMutation();
	const hasRequestedRef = useRef(false);

	const hasThoughts = Boolean(lingeringThoughts?.trim().length);
	/** Use React Query `data` so the UI updates even if `mutate({ onSuccess })` runs after a Strict Mode remount. */
	const aiResult: ReframeResponse | null = data ?? null;
	const isCrisis = aiResult?.distortion === "Crisis";

	useEffect(() => {
		if (!hasThoughts || !lingeringThoughts?.trim()) return;
		if (hasRequestedRef.current) return;
		hasRequestedRef.current = true;
		mutate({ lingeringThoughts: lingeringThoughts.trim() });
	}, [hasThoughts, lingeringThoughts, mutate]);

	const handleUseReframe = () => {
		if (aiResult?.suggestedReframe) {
			setReframedThought(aiResult.suggestedReframe);
		}
	};

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		goNext();
	};

	return (
		<form
			onSubmit={onSubmit}
			className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-8"
		>
			<div className="space-y-4 text-center">
				<p className="text-xs font-semibold uppercase tracking-widest text-primary">
					Step 4 of 5
				</p>
				<h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
					A kinder angle
				</h1>
				{hasThoughts && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-left text-sm italic leading-relaxed text-muted-foreground"
					>
						&ldquo;{lingeringThoughts}&rdquo;
					</motion.div>
				)}
			</div>

			{isPending && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center gap-3 py-6"
				>
					<motion.div
						animate={{ y: [0, -12, 0] }}
						transition={{
							repeat: Infinity,
							duration: 1.1,
							ease: "easeInOut",
						}}
					>
						<MochiDefault className="size-16" />
					</motion.div>
					<p className="text-sm text-muted-foreground">
						{mochiName} is thinking about this...
					</p>
				</motion.div>
			)}

			{aiResult && !isCrisis && (
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<Card className="border-primary/20 bg-primary/5 shadow-sm">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-2">
								<Sparkles className="size-4 text-primary" />
								<CardTitle className="text-sm font-semibold text-primary">
									{mochiName}&apos;s insight
								</CardTitle>
							</div>
							<CardDescription className="flex items-center gap-2 pt-1">
								<Badge variant="secondary" className="text-xs">
									{aiResult.distortion}
								</Badge>
								<span className="text-xs text-muted-foreground">
									cognitive pattern detected
								</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{aiResult.socraticQuestion && (
								<div className="flex gap-2">
									<Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
									<p className="text-sm leading-relaxed text-foreground">
										{aiResult.socraticQuestion}
									</p>
								</div>
							)}
							<div className="rounded-lg border border-border/60 bg-card px-4 py-3">
								<p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Suggested reframe
								</p>
								<p className="text-sm leading-relaxed text-foreground">
									{aiResult.suggestedReframe}
								</p>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full rounded-lg"
								onClick={handleUseReframe}
							>
								Use this reframe
							</Button>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{isCrisis && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-foreground"
				>
					<p className="font-semibold text-destructive">
						It sounds like you might be going through something serious.
					</p>
					<p className="mt-2">{aiResult.suggestedReframe}</p>
				</motion.div>
			)}

			{isError && (
				<p className="text-center text-sm text-destructive" role="alert">
					{error?.message ??
						"Couldn't load a suggestion. You can still write your own reframe below."}
				</p>
			)}

			{!hasThoughts && !isPending && (
				<p className="text-center text-sm text-muted-foreground">
					Nothing to reframe. That&apos;s okay. You can skip this step or write
					a kind thought for yourself.
				</p>
			)}

			<Textarea
				placeholder="Write your own reframed thought, or edit the suggestion above…"
				id="reframed-response"
				className="min-h-[120px] resize-y rounded-xl border-border/80 bg-card text-base leading-relaxed"
				rows={5}
				value={reframedThought || ""}
				onChange={(e) => setReframedThought(e.target.value)}
			/>

			<p className="text-center text-xs text-muted-foreground">
				{mochiName} is a wellness tool, not a therapist. This exercise is for
				self-reflection only.
			</p>

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
