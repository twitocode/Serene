"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/lib/components/ui/button";
import {
	BOX_BREATHING_CYCLE,
	BREATHING_TOTAL_CYCLES,
} from "@/lib/data/grounding-scripts";

interface BreathingPacerProps {
	onComplete: () => void;
}

export default function BreathingPacer({ onComplete }: BreathingPacerProps) {
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [cycle, setCycle] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const phase = BOX_BREATHING_CYCLE[phaseIndex % BOX_BREATHING_CYCLE.length];
	const phaseSec = Math.round((phase?.durationMs ?? 4000) / 1000);
	const isExpanding = phaseIndex % BOX_BREATHING_CYCLE.length === 0;
	const isHolding =
		phaseIndex % BOX_BREATHING_CYCLE.length === 1 ||
		phaseIndex % BOX_BREATHING_CYCLE.length === 3;
	const finished = cycle >= BREATHING_TOTAL_CYCLES;

	const advancePhase = useCallback(() => {
		setPhaseIndex((prev) => {
			const next = prev + 1;
			if (next % BOX_BREATHING_CYCLE.length === 0) {
				setCycle((c) => c + 1);
			}
			return next;
		});
	}, []);

	useEffect(() => {
		if (!isRunning || finished) return;

		setCountdown(phaseSec);
		timerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					advancePhase();
					return phaseSec;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isRunning, finished, phaseSec, advancePhase]);

	useEffect(() => {
		if (finished && isRunning) {
			setIsRunning(false);
		}
	}, [finished, isRunning]);

	const circleScale = isExpanding
		? 1.6
		: isHolding
			? phaseIndex % BOX_BREATHING_CYCLE.length === 1
				? 1.6
				: 1
			: 1;

	return (
		<div className="flex flex-col items-center gap-8 py-4">
			<div className="relative flex h-[320px] items-center justify-center">
				<motion.div
					animate={{ scale: isRunning && !finished ? circleScale : 1 }}
					transition={{ duration: phaseSec, ease: "easeInOut" }}
					className="flex size-48 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/30 cursor-pointer transition-colors hover:bg-primary/20"
					onClick={() => {
						if (!finished) setIsRunning(!isRunning);
					}}
				>
					<div className="flex size-32 items-center justify-center rounded-full bg-primary/20">
						<span className="text-center text-sm font-medium text-primary">
							{!isRunning && !finished && "Tap to start"}
							{isRunning && !finished && phase?.label}
							{finished && "Done"}
						</span>
					</div>
				</motion.div>
			</div>

			<p className="text-2xl font-semibold tabular-nums text-foreground h-8">
				{isRunning && !finished ? countdown : ""}
			</p>

			<p className="text-xs text-muted-foreground">
				{finished
					? "Great work. Take a moment before continuing."
					: `Cycle ${Math.min(cycle + 1, BREATHING_TOTAL_CYCLES)} of ${BREATHING_TOTAL_CYCLES}`}
			</p>

			{finished && (
				<Button onClick={onComplete} size="lg" className="rounded-xl">
					Done
				</Button>
			)}
		</div>
	);
}
