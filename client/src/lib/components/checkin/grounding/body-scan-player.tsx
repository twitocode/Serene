"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/lib/components/ui/button";
import { Progress } from "@/lib/components/ui/progress";
import { BODY_SCAN_STEPS } from "@/lib/data/grounding-scripts";

interface BodyScanPlayerProps {
	onComplete: () => void;
}

export default function BodyScanPlayer({ onComplete }: BodyScanPlayerProps) {
	const [stepIndex, setStepIndex] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const step = BODY_SCAN_STEPS[stepIndex];
	const finished = stepIndex >= BODY_SCAN_STEPS.length;
	const totalSteps = BODY_SCAN_STEPS.length;
	const progressPercent = finished
		? 100
		: ((stepIndex + elapsed / (step?.durationMs ?? 1)) / totalSteps) * 100;

	const advance = useCallback(() => {
		setStepIndex((prev) => prev + 1);
		setElapsed(0);
	}, []);

	useEffect(() => {
		if (!isRunning || finished) return;

		const interval = 100;
		timerRef.current = setInterval(() => {
			setElapsed((prev) => {
				const next = prev + interval;
				if (next >= (step?.durationMs ?? 12000)) {
					advance();
					return 0;
				}
				return next;
			});
		}, interval);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isRunning, finished, step?.durationMs, advance]);

	useEffect(() => {
		if (finished && isRunning) {
			setIsRunning(false);
		}
	}, [finished, isRunning]);

	return (
		<div className="flex flex-col gap-6 py-4">
			<Progress value={progressPercent} className="h-1.5" />

			<div className="min-h-[140px]">
				<AnimatePresence mode="wait">
					{!finished && step ? (
						<motion.div
							key={stepIndex}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{ duration: 0.4 }}
							className="space-y-3"
						>
							<p className="text-xs font-semibold uppercase tracking-widest text-primary">
								{step.region}
							</p>
							<p className="text-base leading-relaxed text-foreground">
								{step.instruction}
							</p>
						</motion.div>
					) : (
						<motion.div
							key="done"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-3 text-center"
						>
							<p className="text-xs font-semibold uppercase tracking-widest text-primary">
								Complete
							</p>
							<p className="text-base leading-relaxed text-foreground">
								Well done. Take a few breaths before moving on.
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<p className="text-xs text-muted-foreground">
				{finished
					? "Body scan complete"
					: `Region ${stepIndex + 1} of ${totalSteps}`}
			</p>

			<div className="flex gap-3">
				{!isRunning && !finished && (
					<Button
						onClick={() => setIsRunning(true)}
						size="lg"
						className="flex-1 rounded-xl"
					>
						{stepIndex === 0 ? "Begin scan" : "Resume"}
					</Button>
				)}

				{isRunning && !finished && (
					<Button
						onClick={() => setIsRunning(false)}
						size="lg"
						variant="outline"
						className="flex-1 rounded-xl"
					>
						Pause
					</Button>
				)}

				{isRunning && !finished && (
					<Button
						onClick={advance}
						size="lg"
						variant="ghost"
						className="rounded-xl"
					>
						Skip region
					</Button>
				)}

				{finished && (
					<Button onClick={onComplete} size="lg" className="flex-1 rounded-xl">
						Done
					</Button>
				)}
			</div>
		</div>
	);
}
