"use client";

import { Calendar, ExportSquare, InfoCircle } from "iconsax-reactjs";
import { motion } from "motion/react";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";

export function SWCBookingGuide() {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			className="card-glass relative p-6 shadow-md overflow-hidden mb-8 transition-all duration-200"
		>
			<div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl animate-breathe" />
			<div
				className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-warm/10 blur-2xl animate-breathe"
				style={{ animationDelay: "3s" }}
			/>
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-4">
					<div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
						<Calendar variant="Bulk" size={28} color="currentColor" />
					</div>
					<div className="space-y-0.5">
						<h3 className="font-serif text-2xl font-semibold text-foreground">
							Booking at SWC
						</h3>
						<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Student Wellness Centre
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6">
					<div className="space-y-4">
						<h4 className="font-semibold text-lg flex items-center gap-2">
							<Badge
								variant="outline"
								className="rounded-full size-6 flex items-center justify-center p-0 border-primary/30 text-primary"
							>
								1
							</Badge>
							Initial Consultation
						</h4>
						<p className="text-sm text-muted-foreground leading-relaxed">
							All students begin with an initial consultation. This is a
							30-minute meeting with a mental health professional to discuss
							your concerns and determine next steps.
						</p>
						<div className="bg-primary/8 border border-primary/15 p-4 rounded-2xl flex items-start gap-3">
							<InfoCircle variant="Bulk" size={20} color="currentColor" />
							<div>
								<p className="text-sm font-medium text-primary">
									Wait Time Estimates
								</p>
								<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
									Consultations are usually available within 1-2 weeks. However,
									subsequent appointments can have longer waitlists (4+ weeks).
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h4 className="font-semibold text-lg flex items-center gap-2">
							<Badge
								variant="outline"
								className="rounded-full size-6 flex items-center justify-center p-0 border-primary/30 text-primary"
							>
								2
							</Badge>
							How to Book
						</h4>
						<ul className="space-y-3 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="font-bold text-foreground">Call:</span> (905)
								525-9140 ext. 27700
							</li>
							<li className="flex items-start gap-2">
								<span className="font-bold text-foreground">In-Person:</span>{" "}
								Visit the reception desk in PGCLL 210.
							</li>
							<li className="flex items-start gap-2">
								<span className="font-bold text-foreground">Virtual:</span>{" "}
								Follow-up appointments may be offered via telehealth.
							</li>
						</ul>
						<Button
							className="w-full gap-2 mt-4 btn-playful rounded-xl"
							asChild
						>
							<a
								href="https://wellness.mcmaster.ca/services/counselling/"
								target="_blank"
								rel="noreferrer"
							>
								Visit SWC Website
								<ExportSquare
									variant="Outline"
									size={16}
									color="currentColor"
								/>
							</a>
						</Button>
					</div>
				</div>

				<div className="border-t border-border/40 pt-4 text-[10px] text-muted-foreground italic">
					*Source: McMaster Health Forum reports indicate high demand during
					peak seasons (Nov/Mar).
				</div>
			</div>
		</motion.div>
	);
}
