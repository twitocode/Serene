"use client";

import { Message } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type FeedbackDto, getFeedback } from "@/lib/client/admin-client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/lib/components/ui/table";

const stagger = {
	container: {
		animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
	},
	item: {
		initial: { opacity: 0, y: 14 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.45 },
		},
	},
} as const;

export default function FeedbackAdminPage() {
	const [feedback, setFeedback] = useState<FeedbackDto[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchFeedback = useCallback(async () => {
		const res = await getFeedback();
		if (res.isSuccess && res.data) {
			setFeedback(res.data.feedback);
		} else {
			toast.error("Failed to fetch feedback");
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchFeedback();
	}, [fetchFeedback]);

	return (
		<div className="relative mx-auto flex min-h-full max-w-4xl flex-col gap-10 px-4 py-6 md:py-10">
			{/* Header */}
			<motion.div
				variants={stagger.container}
				initial="initial"
				animate="animate"
				className="flex flex-col gap-2"
			>
				<motion.div variants={stagger.item} className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Message variant="Bulk" size={16} color="currentColor" />
					</div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						Management
					</p>
				</motion.div>
				<motion.h1
					variants={stagger.item}
					className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
				>
					User Feedback
				</motion.h1>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="card-glass overflow-hidden shadow-md"
			>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-sidebar-border/60">
							<TableHead className="font-semibold text-foreground">
								Date
							</TableHead>
							<TableHead className="font-semibold text-foreground">
								User
							</TableHead>
							<TableHead className="font-semibold text-foreground">
								Message
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3} className="h-48 text-center">
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<Loader2 className="h-8 w-8 animate-spin" />
										<p className="text-sm font-medium">Loading feedback...</p>
									</div>
								</TableCell>
							</TableRow>
						) : feedback.length === 0 ? (
							<TableRow>
								<TableCell colSpan={3} className="h-48 text-center">
									<p className="text-muted-foreground font-medium">
										No feedback found.
									</p>
								</TableCell>
							</TableRow>
						) : (
							feedback.map((item, index) => (
								<TableRow
									key={index}
									className="border-sidebar-border/40 hover:bg-sidebar-accent/50 transition-colors"
								>
									<TableCell className="whitespace-nowrap text-sm text-muted-foreground">
										{item.date}
									</TableCell>
									<TableCell className="font-mono text-[10px] text-muted-foreground uppercase tracking-tight">
										{item.userId.split("-")[0]}...
									</TableCell>
									<TableCell className="max-w-xl break-words text-sm leading-relaxed text-foreground/90">
										{item.message}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</motion.div>
		</div>
	);
}
