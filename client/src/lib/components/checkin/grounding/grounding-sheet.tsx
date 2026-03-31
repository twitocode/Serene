"use client";

import { Scan, Wind } from "lucide-react";
import { useState } from "react";
import BodyScanPlayer from "@/lib/components/checkin/grounding/body-scan-player";
import BreathingPacer from "@/lib/components/checkin/grounding/breathing-pacer";
import { Button } from "@/lib/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/lib/components/ui/sheet";

type Exercise = "breathing" | "body-scan" | null;

interface GroundingSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function GroundingSheet({
	open,
	onOpenChange,
}: GroundingSheetProps) {
	const [exercise, setExercise] = useState<Exercise>(null);

	const handleClose = () => {
		setExercise(null);
		onOpenChange(false);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="max-h-[85vh] overflow-y-auto rounded-t-2xl"
			>
				<SheetHeader className="text-center">
					<SheetTitle className="font-serif text-xl">
						{exercise === null && "Take a moment to ground yourself"}
						{exercise === "breathing" && "Box Breathing"}
						{exercise === "body-scan" && "Guided Body Scan"}
					</SheetTitle>
					<SheetDescription>
						{exercise === null &&
							"You logged physical sensations. A short exercise can help you sit with them gently."}
						{exercise === "breathing" &&
							"Inhale, hold, exhale, hold; each for 4 seconds. This activates your vagus nerve, slowing your heart rate."}
						{exercise === "body-scan" &&
							"A slow sweep from toes to head. Observe each region without trying to change anything."}
					</SheetDescription>
				</SheetHeader>

				<div className="px-4 pb-6 pt-2">
					{exercise === null && (
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button
								variant="outline"
								size="lg"
								className="flex-1 gap-2 rounded-xl"
								onClick={() => setExercise("breathing")}
							>
								<Wind className="size-5" />
								Box Breathing
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="flex-1 gap-2 rounded-xl"
								onClick={() => setExercise("body-scan")}
							>
								<Scan className="size-5" />
								Body Scan
							</Button>
						</div>
					)}

					{exercise === "breathing" && (
						<BreathingPacer onComplete={handleClose} />
					)}

					{exercise === "body-scan" && (
						<BodyScanPlayer onComplete={handleClose} />
					)}

					{exercise === null && (
						<Button
							variant="ghost"
							className="mt-4 w-full text-muted-foreground"
							onClick={handleClose}
						>
							Skip for now
						</Button>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
