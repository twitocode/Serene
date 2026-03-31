"use client";

import { Heart, MessageSquare, Users } from "lucide-react";
import { TrendCard } from "@/lib/components/trends/trend-card";
import { Badge } from "@/lib/components/ui/badge";
import { useInterestsQuery } from "@/lib/hooks/queries/use-peers";
import type { CommunityStats } from "@/lib/hooks/queries/use-trends";
import { useUserQuery } from "@/lib/hooks/queries/use-user";

interface SocialTrendsProps {
	data?: CommunityStats;
}

export function SocialTrends({ data }: SocialTrendsProps) {
	const { data: user } = useUserQuery();
	const { data: interests } = useInterestsQuery();

	const answersCount = data?.answersCount || user?.posts?.length || 0;
	const matchesCount = data?.matchesCount || user?.profile?.currentStreak || 0; // Fallback to streak if no matches field
	const supportCount = data?.supportCount || 0;

	return (
		<TrendCard
			title="Community & Growth"
			subtitle="Your engagement within the Serene community"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
						<MessageSquare className="w-5 h-5 text-zinc-400 mb-2" />
						<span className="text-xl font-semibold text-foreground">
							{answersCount}
						</span>
						<span className="text-[10px] text-muted-foreground uppercase">
							Answers
						</span>
					</div>
					<div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
						<Users className="w-5 h-5 text-zinc-400 mb-2" />
						<span className="text-xl font-semibold text-foreground">
							{matchesCount}
						</span>
						<span className="text-[10px] text-muted-foreground uppercase">
							Matches
						</span>
					</div>
					<div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
						<Heart className="w-5 h-5 text-zinc-400 mb-2" />
						<span className="text-xl font-semibold text-foreground">
							{supportCount}
						</span>
						<span className="text-[10px] text-muted-foreground uppercase">
							Support
						</span>
					</div>
				</div>

				<div>
					<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
						Your Interests
					</h4>
					<div className="flex flex-wrap gap-2">
						{interests && interests.length > 0 ? (
							interests.map((interest) => (
								<Badge
									key={interest}
									variant="outline"
									className="rounded-full border-zinc-200 text-zinc-600 font-normal py-1 px-3"
								>
									{interest}
								</Badge>
							))
						) : (
							<span className="text-sm text-muted-foreground">
								No interests selected yet.
							</span>
						)}
					</div>
				</div>
			</div>
		</TrendCard>
	);
}
