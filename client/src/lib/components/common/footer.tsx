import { Github, Heart } from "lucide-react";
import Link from "next/link";
import SereneLogo from "@/lib/components/common/serene-logo";

export default function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-primary/20 bg-gradient-to-br from-primary via-primary to-[color-mix(in_oklch,var(--mochi-body),var(--mochi-cheek)_25%)] text-primary-foreground">
			{/* Subtle decorative orb */}
			<div
				className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/[0.06] blur-3xl"
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full bg-white/[0.04] blur-2xl"
				aria-hidden
			/>

			<div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-16 md:flex-row md:justify-between md:px-10">
				<div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
					<SereneLogo className="text-primary-foreground [&_span]:text-primary-foreground" />
					<p className="max-w-xs text-sm leading-relaxed text-primary-foreground/80">
						A calm corner for checking in, reflecting, and growing&mdash;one day at a
						time.
					</p>
				</div>
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-3">
					<Link
						href="https://github.com/twitocode/serene"
						className="pill-interactive inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
						target="_blank"
						rel="noreferrer"
					>
						<Github className="size-4" />
						Source on GitHub
					</Link>
					<span className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/60">
						Made with <Heart className="size-3 fill-current" /> for students
					</span>
				</div>
			</div>
		</footer>
	);
}
