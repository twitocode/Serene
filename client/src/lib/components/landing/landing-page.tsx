"use client";
import { Heart, Leaf, Shield } from "lucide-react";
import Link from "next/link";
import Footer from "@/lib/components/common/footer";
import { Navbar } from "@/lib/components/common/navbar";
import { Button } from "@/lib/components/ui/button";

const pillars = [
	{
		title: "Evidence-informed",
		body: "Tools grounded in CBT and mindfulness, explained in plain language, without jargon.",
		icon: Leaf,
	},
	{
		title: "Student-first",
		body: "Built around academic stress, social life, and the rhythms of campus, not generic advice.",
		icon: Heart,
	},
	{
		title: "Privacy-minded",
		body: "Your reflections stay yours. We design for trust, clarity, and control.",
		icon: Shield,
	},
];

export default function LandingPage() {
	return (
		<>
			<div className="relative min-h-screen overflow-hidden mesh-sanctuary paper-grain">
				<div
					className="absolute top-24 left-[8%] size-72 blob blob-sanctuary opacity-20 animate-blob"
					aria-hidden
				/>
				<div
					className="absolute top-36 right-[5%] size-56 blob blob-warm opacity-15 animate-blob"
					style={{ animationDelay: "2s" }}
					aria-hidden
				/>
				<div
					className="absolute bottom-32 left-[20%] size-64 blob blob-mist opacity-25 animate-blob"
					style={{ animationDelay: "4s" }}
					aria-hidden
				/>

				<div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-8 md:px-10 lg:px-12">
					<Navbar />
					<section className="mx-auto mt-16 flex max-w-3xl flex-col items-center text-center md:mt-24">
						<p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
							Mental wellness for students
						</p>
						<h1 className="font-serif text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
							A gentler way through{" "}
							<span className="text-primary">stressful semesters</span>
						</h1>
						<p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
							Track how you feel over time, learn skills that fit student life,
							and check in with a companion that meets you where you are; no
							pressure to be &ldquo;fine.&rdquo;
						</p>
						<div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
							<Link href="/signup">
								<Button
									size="lg"
									className="btn-playful h-12 min-w-[200px] px-8 text-base shadow-md"
								>
									Begin quietly
								</Button>
							</Link>
							<Link href="/login">
								<Button variant="ghost" className="h-12 text-muted-foreground">
									I already have an account
								</Button>
							</Link>
						</div>
					</section>

					<section className="mx-auto mt-28 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8">
						{pillars.map(({ title, body, icon: Icon }) => (
							<div
								key={title}
								className="card-organic flex flex-col gap-4 border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur-sm"
							>
								<div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
									<Icon className="size-5" strokeWidth={2} />
								</div>
								<h2 className="font-serif text-lg font-semibold text-foreground">
									{title}
								</h2>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{body}
								</p>
							</div>
						))}
					</section>

					<section className="mx-auto mt-24 max-w-2xl text-center">
						<blockquote className="font-serif text-xl font-medium italic leading-relaxed text-foreground md:text-2xl">
							&ldquo;You don&apos;t have to carry everything alone.&rdquo;
						</blockquote>
						<p className="mt-4 text-sm text-muted-foreground">
							The idea behind Serene
						</p>
					</section>
				</div>
			</div>
			<Footer />
		</>
	);
}
