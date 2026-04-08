"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MochiSleepy } from "@/lib/components/common/mochi";

export default function NotFound() {
	return (
		<div className="min-h-[80vh] max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col items-center justify-center w-full py-16 px-6 text-center"
			>
				<MochiSleepy className="size-40 mb-6" />
				<h1 className="text-4xl font-semibold font-serif mb-4 text-foreground">
					You've wandered off the path
				</h1>
				<p className="text-muted-foreground text-lg max-w-md mx-auto mb-8 leading-relaxed">
					The page you are looking for doesn't exist or might have been moved.
				</p>
				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href="/home"
						className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
					>
						Return to Home
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
