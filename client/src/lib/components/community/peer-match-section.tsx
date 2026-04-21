"use client";

import { motion } from "motion/react";
import InterestPicker from "@/lib/components/community/interest-picker";
import PeerMatchCard from "@/lib/components/community/peer-match-card";
import { Separator } from "@/lib/components/ui/separator";
import {
	useInterestsQuery,
	usePeerMatchQuery,
} from "@/lib/hooks/queries/use-peers";

export function PeerMatchSection() {
	const { data: interests = [] } = useInterestsQuery();
	const hasInterests = interests.length >= 3;
	const { data: match, isPending } = usePeerMatchQuery(hasInterests);

	// Don't show anything while loading or if they have interests but no match yet
	if (hasInterests && (isPending || !match)) {
		return null;
	}

	return (
		<motion.section
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
			className="mb-8"
		>
			<Separator className="mb-8 bg-border/80" />

			{hasInterests ? (
				<div className="flex flex-col gap-4">
					<h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Wellness buddy
					</h3>
					<PeerMatchCard />
				</div>
			) : (
				<div className="card-organic border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm md:p-8">
					<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Wellness buddy
					</p>
					<InterestPicker />
				</div>
			)}
		</motion.section>
	);
}
