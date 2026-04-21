"use client";

import { Magicpen, People } from "iconsax-reactjs";
import { motion } from "motion/react";
import { Badge } from "@/lib/components/ui/badge";
import { usePeerMatchQuery } from "@/lib/hooks/queries/use-peers";

const CONVERSATION_STARTERS: Record<string, string> = {
	Music: "What song has been on repeat for you lately?",
	Hiking: "What's a trail you've been wanting to try?",
	Gaming: "What game have you been playing recently?",
	Cooking: "What's the last thing you cooked that turned out great?",
	Reading: "Read any good books lately?",
	Photography: "What's the best photo you've taken recently?",
	"Art & Design": "Working on any creative projects?",
	Fitness: "What's your go-to workout?",
	"Film & TV": "Watched anything good recently?",
	Writing: "Are you working on anything you're excited about?",
	Coding: "Built anything cool lately?",
	Fashion: "Found any good style inspiration recently?",
	Travel: "Where would you go if you could take a trip right now?",
	Volunteering: "What cause matters most to you?",
	"Board Games": "What's your favorite game to play with friends?",
	Dancing: "What kind of music makes you want to dance?",
	Meditation: "How do you like to wind down?",
	Sports: "Caught any good games lately?",
	Podcasts: "Listening to anything interesting?",
	Languages: "Which language would you love to learn next?",
};

function getStarter(interest: string): string {
	return (
		CONVERSATION_STARTERS[interest] ||
		`What do you enjoy most about ${interest.toLowerCase()}?`
	);
}

export default function PeerMatchCard() {
	const { data: match, isPending } = usePeerMatchQuery();

	if (isPending) return null;
	if (!match) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.15 }}
		>
			<div className="card-organic border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<People variant="Bulk" size={20} color="currentColor" />
					<h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
						Your wellness buddy
					</h3>
				</div>

				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary ring-1 ring-primary/15">
							{match.anonymousName
								.split(" ")
								.map((w) => w[0])
								.join("")}
						</div>
						<div className="space-y-1">
							<p className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
								{match.anonymousName}
							</p>
							<div className="flex items-center gap-2">
								<Badge
									variant="secondary"
									className="rounded-full bg-primary/8 text-primary border-primary/10 px-2.5 py-0.5 text-xs"
								>
									<Magicpen variant="Bulk" size={12} color="currentColor" />
									{match.sharedInterest}
								</Badge>
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-border/60 bg-muted/20 px-5 py-4">
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
							Conversation starter
						</p>
						<p className="mt-2 text-base leading-relaxed text-foreground">
							{getStarter(match.sharedInterest)}
						</p>
					</div>

					<p className="text-center text-xs text-muted-foreground/70 italic">
						Matched based on shared interests. Fully anonymous.
					</p>
				</div>
			</div>
		</motion.div>
	);
}
