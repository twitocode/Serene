"use client";

import { ArrowRight, ArrowRight2, Lovely, Magicpen, Wind } from "iconsax-reactjs";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RecentBadges from "@/lib/components/achievements/recent-badges";
import { AnimatedMochi as Mochi } from "@/lib/components/common/animated-mochi";
import { MochiDefault, MochiHappy } from "@/lib/components/common/mochi";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useUserQuery } from "@/lib/hooks/queries/use-user";

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}

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

export default function HomePage() {
	const router = useRouter();
	const { startCheckin } = useCheckinStore((s) => s);
	const { data: user } = useUserQuery();

	const handleStartCheckin = () => {
		startCheckin();
		router.push("/home/checkin");
	};

	const mochiName = user?.profile?.mochiName || "Mochi";

	const suggestions = [
		{
			id: "1",
			icon: MochiDefault,
			title: `Talk to ${mochiName}`,
			hint: "Companion chat",
			gradient: "from-primary/12 to-primary/4",
			hoverRing: "group-hover:ring-primary/25",
		},
		{
			id: "2",
			icon: Lovely,
			title: "Daily affirmations",
			hint: "Gentle words",
			gradient: "from-warm/12 to-warm/4",
			hoverRing: "group-hover:ring-warm/25",
		},
		{
			id: "3",
			icon: Wind,
			title: "Box breathing",
			hint: "Ground your body",
			gradient: "from-primary/12 to-warm/6",
			hoverRing: "group-hover:ring-primary/25",
		},
	];

	return (
		<div className="relative mx-auto flex min-h-full max-w-2xl flex-col gap-10 px-4 py-6 md:py-10">
			{/* Header */}
			<motion.div
				variants={stagger.container}
				initial="initial"
				animate="animate"
				className="flex flex-col gap-2"
			>
				<motion.p
					variants={stagger.item}
					className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
				>
					Today
				</motion.p>
				<motion.h1
					variants={stagger.item}
					className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
				>
					{getGreeting()}
				</motion.h1>
				<motion.p
					variants={stagger.item}
					className="max-w-md text-sm leading-relaxed text-muted-foreground"
				>
					However you feel right now is valid. Take a breath, this space is
					yours.
				</motion.p>
			</motion.div>

			<DateScroll readOnly />

			{/* Check-in CTA card */}
			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="card-glass relative overflow-hidden p-6 shadow-md md:p-8"
			>
				{/* Ambient glow blobs */}
				<div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl animate-breathe" />
				<div
					className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-warm/10 blur-2xl animate-breathe"
					style={{ animationDelay: "3s" }}
				/>

				<div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex justify-center md:justify-start">
						<div className="relative">
							<Mochi className="size-36 drop-shadow-md md:size-40" />
							{/* Soft shadow beneath Mochi */}
							<div
								className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-primary/8 blur-lg"
								aria-hidden
							/>
						</div>
					</div>
					<div className="flex max-w-md flex-col gap-4">
						<div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium text-primary shadow-2xs">
							<Magicpen variant="Bulk" size={14} color="currentColor" />
							Quick check-in
						</div>
						<h2 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
							Stressed about exams or deadlines?
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							A short guided check-in can help name what you&apos;re carrying,
							at your pace, with no judgment.
						</p>
						<Button
							onClick={handleStartCheckin}
							size="lg"
							className="btn-playful group w-full sm:w-auto"
						>
							Start a check-in
							<ArrowRight variant="oultine" size={16} color="currentColor" />
						</Button>
					</div>
				</div>
			</motion.section>

			{/* Suggestions */}
			<div className="flex flex-col gap-4">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="flex items-end justify-between gap-4"
				>
					<div>
						<h3 className="font-serif text-xl font-semibold text-foreground">
							Suggested for you
						</h3>
						<p className="text-sm text-muted-foreground">
							Small steps you can take today
						</p>
					</div>
				</motion.div>

				<motion.div
					variants={stagger.container}
					initial="initial"
					animate="animate"
					className="grid grid-cols-1 gap-3 sm:grid-cols-3"
				>
					{suggestions.map((suggestion) => {
						const Icon = suggestion.icon;
						const link = `/home/explore/${suggestion.id}`;

						return (
							<Link href={link} key={suggestion.id} className="group block">
								<motion.div
									variants={stagger.item}
									whileHover={{ y: -4, transition: { duration: 0.2 } }}
									className="card-glass flex h-full flex-col gap-3 p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/25"
								>
									<div
										className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${suggestion.gradient} text-foreground ring-1 ring-border/50 transition-all duration-300 ${suggestion.hoverRing} group-hover:scale-110`}
									>
										<Icon variant="Bulk" size={28} color="currentColor" />
									</div>
									<div className="space-y-1">
										<p className="font-medium leading-snug text-foreground">
											{suggestion.title}
										</p>
										<p className="text-xs text-muted-foreground">
											{suggestion.hint}
										</p>
									</div>
								</motion.div>
							</Link>
						);
					})}
				</motion.div>
			</div>

			<RecentBadges />
		</div>
	);
}
