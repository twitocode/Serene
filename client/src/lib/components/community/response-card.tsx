import { Star1 } from "iconsax-reactjs";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import type { QOTDAnswerDto } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";

export const ResponseCard = ({
	response,
	isMe,
}: {
	response: QOTDAnswerDto;
	isMe?: boolean;
}) => {
	return (
		<motion.article
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className={cn(
				"card-organic w-full border-border/80 p-5 shadow-sm",
				isMe
					? "border-primary/25 bg-primary/5 ring-1 ring-primary/10"
					: "bg-card/90 backdrop-blur-sm",
			)}
		>
			<div className="mb-3 flex items-center gap-3">
				<Avatar className="size-10 border border-border/60">
					<AvatarFallback
						className={cn(
							"text-sm font-medium",
							isMe
								? "bg-primary/15 text-primary"
								: "bg-muted text-muted-foreground",
						)}
					>
						{isMe ? (
							<Star1 variant="Bulk" size={16} color="currentColor" />
						) : (
							(response.username?.[0] ?? "?").toUpperCase()
						)}
					</AvatarFallback>
				</Avatar>

				<span className="font-medium text-foreground">
					{isMe ? "You" : response.username || "Anonymous"}
				</span>
			</div>
			<p className="text-sm leading-relaxed text-foreground/90 md:text-base">
				{response.answer}
			</p>
		</motion.article>
	);
};
