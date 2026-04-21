"use client";

import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/lib/components/ui/button";

export function CrisisBanner() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="card-glass relative overflow-hidden p-6 shadow-md mb-8"
		>
			<div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-destructive/10 blur-3xl animate-breathe" />
			<div
				className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-destructive/8 blur-2xl animate-breathe"
				style={{ animationDelay: "3s" }}
			/>

			<div className="relative flex flex-col lg:flex-row items-center gap-6 justify-between">
				<div className="flex items-center gap-4 text-center lg:text-left">
					<div className="bg-destructive/10 p-3 rounded-full hidden sm:block ring-1 ring-destructive/20">
						<ShieldAlert className="size-8 text-destructive" />
					</div>
					<div className="space-y-1">
						<h3 className="text-xl font-bold text-foreground">
							In Crisis? Get Help Now.
						</h3>
						<p className="text-sm text-muted-foreground max-w-md">
							If you are in immediate danger or need urgent support, please use these 24/7 McMaster and community resources.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
					<Button
						className="gap-2 font-bold h-12 btn-playful"
						asChild
					>
						<a href="tel:18669255454">
							<PhoneCall className="size-4" />
							Good2Talk (24/7)
						</a>
					</Button>
					<Button
						variant="outline"
						className="gap-2 border-border hover:border-primary/40 hover:bg-primary/5 h-12"
						asChild
					>
						<a href="tel:9055259140,24281">
							<AlertTriangle className="size-4" />
							Security: ext 24281
						</a>
					</Button>
				</div>
			</div>

			<div className="relative mt-4 pt-4 border-t border-border/40 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
				<span className="flex items-center gap-1.5">
					<span className="size-1.5 rounded-full bg-destructive" />
					SWC Emergency: ext 27700
				</span>
				<span className="flex items-center gap-1.5">
					<span className="size-1.5 rounded-full bg-destructive" />
					Crisis Text Line: Text GOOD2TALKON to 686868
				</span>
			</div>
		</motion.div>
	);
}
