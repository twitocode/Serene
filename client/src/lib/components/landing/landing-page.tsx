"use client";
import Footer from "@/lib/components/common/footer";
import { MochiHappy } from "@/lib/components/common/mochi";
import { Navbar } from "@/lib/components/common/navbar";
import { Button } from "@/lib/components/ui/button";
import { ArrowRight, Heart, Leaf, Shield } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const pillars = [
	{
		title: "Evidence-informed",
		body: "Tools grounded in CBT and mindfulness, explained in plain language, without jargon.",
		icon: Leaf,
		accent: "bg-primary/10 text-primary ring-primary/15",
	},
	{
		title: "Student-first",
		body: "Built around academic stress, social life, and the rhythms of campus, not generic advice.",
		icon: Heart,
		accent: "bg-warm/10 text-warm ring-warm/15",
	},
	{
		title: "Privacy-minded",
		body: "Your reflections stay yours. We design for trust, clarity, and control.",
		icon: Shield,
		accent: "bg-primary/10 text-primary ring-primary/15",
	},
];

const stagger = {
	container: {
		animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
	},
	item: {
		initial: { opacity: 0, y: 18 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	},
} as const;

export default function LandingPage() {
	return (
		<>
			<div className="relative min-h-screen overflow-hidden mesh-sanctuary paper-grain">
				{/* Decorative blobs — subtle, layered */}
				<div
					className="absolute top-16 left-[5%] size-80 blob blob-sanctuary opacity-[0.08] animate-blob"
					aria-hidden
				/>
				<div
					className="absolute top-28 right-[3%] size-64 blob blob-warm opacity-[0.05] animate-blob"
					style={{ animationDelay: "2s" }}
					aria-hidden
				/>
				<div
					className="absolute bottom-24 left-[15%] size-72 blob blob-mist opacity-[0.1] animate-blob"
					style={{ animationDelay: "4s" }}
					aria-hidden
				/>
				<div
					className="absolute top-[60%] right-[12%] size-48 blob blob-sanctuary opacity-[0.04] animate-breathe"
					aria-hidden
				/>

				<div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-10 lg:px-12">
					<Navbar />

					{/* Hero */}
					<motion.section
						variants={stagger.container}
						initial="initial"
						animate="animate"
						className="mx-auto mt-20 flex max-w-3xl flex-col items-center text-center md:mt-28"
					>
						{/* Mochi companion — floating softly above the headline */}
						<motion.div variants={stagger.item} className="relative mb-6">
							<MochiHappy className="size-20 drop-shadow-md md:size-24 animate-float" />
							<div
								className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-16 rounded-full bg-primary/10 blur-md"
								aria-hidden
							/>
						</motion.div>

						<motion.h1
							variants={stagger.item}
							className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.06] tracking-tight text-foreground"
						>
							A gentler way through{" "}
							<span className="relative">
								<span className="text-gradient-mochi">stressful semesters</span>
								<svg
									className="absolute -bottom-2 left-0 w-full opacity-30"
									viewBox="0 0 200 8"
									fill="none"
									aria-hidden
								>
									<path
										d="M2 5.5C30 2 60 2 100 4.5C140 7 170 5 198 3"
										stroke="url(#underline-grad)"
										strokeWidth="3"
										strokeLinecap="round"
									/>
									<defs>
										<linearGradient
											id="underline-grad"
											x1="0"
											y1="0"
											x2="200"
											y2="0"
										>
											<stop offset="0%" stopColor="var(--mochi-body)" />
											<stop offset="100%" stopColor="var(--mochi-cheek)" />
										</linearGradient>
									</defs>
								</svg>
							</span>
						</motion.h1>

						<motion.p
							variants={stagger.item}
							className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
						>
							Track how you feel over time, learn skills that fit student life,
							and check in with a companion that meets you where you are, no
							pressure to be &ldquo;fine.&rdquo;
						</motion.p>

						<motion.div
							variants={stagger.item}
							className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
						>
							<Link href="/signup">
								<Button
									size="lg"
									className="btn-playful group h-12 min-w-55 px-2 text-base shadow-md font-bold"
								>
									Get Started
									<ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
								</Button>
							</Link>
							<Link href="/login">
								<Button
									variant="ghost"
									className="h-13 text-muted-foreground hover:text-foreground"
								>
									I already have an account
								</Button>
							</Link>
						</motion.div>
					</motion.section>

					{/* Pillars */}
					<motion.section
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, margin: "-80px" }}
						variants={stagger.container}
						className="mx-auto mt-24 grid max-w-5xl gap-5 md:grid-cols-3 md:gap-6"
					>
						{pillars.map(({ title, body, icon: Icon, accent }) => (
							<motion.div
								key={title}
								variants={stagger.item}
								className="card-glass group flex flex-col gap-4 p-7 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/25"
							>
								<div
									className={`flex size-12 items-center justify-center rounded-2xl ring-1 ${accent} transition-transform duration-300 group-hover:scale-110`}
								>
									<Icon className="size-5" strokeWidth={1.8} />
								</div>
								<h2 className="font-serif text-lg font-semibold text-foreground">
									{title}
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{body}
								</p>
							</motion.div>
						))}
					</motion.section>

					{/* Quote */}
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-60px" }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mx-auto mt-28 max-w-2xl text-center"
					>
						<div className="relative inline-block">
							<blockquote className="quote-decorative relative font-serif text-xl font-medium italic leading-relaxed text-foreground md:text-2xl lg:text-[1.7rem]">
								&ldquo;You don&apos;t have to carry everything alone.&rdquo;
							</blockquote>
						</div>
						<div className="divider-soft mx-auto mt-6 max-w-30" />
					
					</motion.section>
				</div>
			</div>
			<Footer />
		</>
	);
}
