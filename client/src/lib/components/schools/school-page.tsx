"use client";

import { formatDistanceToNow } from "date-fns";
import {
	BookHeart,
	ExternalLink,
	GraduationCap,
	Loader2,
	Plus,
	Tags,
	UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { addSchoolClub, getMySchool } from "@/lib/client/school-client";
import { CrisisBanner } from "@/lib/components/health/crisis-banner";
import { SWCBookingGuide } from "@/lib/components/health/swc-booking-guide";
import { SelfScreeningTool } from "@/lib/components/health/self-screening-tool";
import { Button } from "@/lib/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { MCMASTER_RESOURCES, schools } from "@/lib/data";
import type { School, SchoolClub, SchoolResource } from "@/lib/types";
import { motion } from "motion/react";

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

export default function SchoolPage() {
	const [school, setSchool] = useState<School | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddClubOpen, setIsAddClubOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [clubForm, setClubForm] = useState({
		name: "",
		summary: "",
		tags: "",
		links: "",
	});

	const fetchSchool = useCallback(async () => {
		setIsLoading(true);
		const res = await getMySchool();
		if (res.isSuccess && res.data) {
			setSchool(res.data);
		} else {
			setSchool(null);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchSchool();
	}, [fetchSchool]);

	const handleAddClub = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!school) return;

		setIsSubmitting(true);
		const res = await addSchoolClub(school.id, clubForm);
		if (res.isSuccess && res.data) {
			toast.success("Community resource added!");
			setClubForm({ name: "", summary: "", tags: "", links: "" });
			setIsAddClubOpen(false);
			setSchool((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					clubs: [res.data!, ...(prev.clubs || [])],
				};
			});
		} else {
			toast.error(res.message || "Failed to add resource");
		}
		setIsSubmitting(false);
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!school) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-8 text-center space-y-4">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
					<BookHeart className="h-10 w-10 text-primary" />
				</div>
				<h2 className="text-2xl font-bold tracking-tight">Your School</h2>
				<p className="text-muted-foreground">
					You haven&apos;t added a school to your profile yet, or your school
					hasn&apos;t been instantiated by the admins. Visit your settings to
					link your school account.
				</p>
				<Link href="/home/account">
					<Button variant="outline" className="gap-2 mt-4">
						<GraduationCap className="size-4" />
						Go to Settings
					</Button>
				</Link>
			</div>
		);
	}

	const matchedSchool = school
		? schools.find((s) => s.name === school.name)
		: null;
	const displayLogo = matchedSchool?.logo;

	return (
		<div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
			<motion.header
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col items-center text-center"
			>
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
					Campus Support
				</p>
				<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
					{school.name === "McMaster University"
						? "Health & Wellness Hub"
						: school.name}
				</h1>
				<p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
					{school.name === "McMaster University"
						? "Official support and student resources for the McMaster community."
						: `${school.city}, ${school.regionCode} • Your local community`}
				</p>

				{displayLogo && (
					<></>
					// <Image
					// 	src={displayLogo}
					// 	alt=""
					// 	width={48}
					// 	height={48}
					// 	className="mt-6 h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
					// />
				)}
			</motion.header>

			<CrisisBanner />

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="flex flex-col gap-6">
					<SelfScreeningTool />
				</div>
				<div className="flex flex-col gap-6">
					<SWCBookingGuide />
				</div>
			</div>

			<div className="relative flex items-center gap-4 py-2">
				<div className="h-px flex-1 bg-border/40" />
				<p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Campus Resources</p>
				<div className="h-px flex-1 bg-border/40" />
			</div>

			<motion.div 
				variants={stagger.container}
				initial="initial"
				animate="animate"
				className="grid gap-8 lg:grid-cols-2" 
				id="resources"
			>
				<motion.div variants={stagger.item} className="space-y-6">
					<div className="space-y-1 border-b border-border/40 pb-3">
						<h3 className="font-serif text-2xl font-semibold text-foreground">Official Resources</h3>
						<p className="text-sm text-muted-foreground">University-led support and services</p>
					</div>

					{school.name === "McMaster University" ? (
						<div className="grid gap-3">
							{MCMASTER_RESOURCES.map((r, i) => (
								<a
									key={r.url  + i.toString()}
									href={r.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group block"
								>
									<div className="card-glass flex flex-col gap-1 p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/25 hover:-translate-y-1">
										<div className="flex items-center justify-between">
											<span className="font-medium text-foreground">{r.name}</span>
											<ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
										</div>
										<span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/8 w-fit px-2 py-0.5 rounded-full border border-primary/15">
											{r.type}
										</span>
									</div>
								</a>
							))}
						</div>
					) : school.resources && school.resources.length > 0 ? (
						<div className="grid gap-3">
							{school.resources.map((r: SchoolResource) => (
								<a
									key={r.id}
									href={r.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group block"
								>
									<div className="card-glass flex flex-col gap-1 p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/25 hover:-translate-y-1">
										<div className="flex items-center justify-between">
											<span className="font-medium text-foreground">{r.name}</span>
											<ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
										</div>
										<span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/8 w-fit px-2 py-0.5 rounded-full border border-primary/15">
											{r.type}
										</span>
									</div>
								</a>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground italic bg-muted/15 rounded-2xl p-8 border border-dashed text-center">
							No official resources listed yet.
						</p>
					)}
				</motion.div>

				<motion.div variants={stagger.item} className="space-y-6">
					<div className="flex items-center justify-between border-b border-border/40 pb-3">
						<div className="space-y-1">
							<h3 className="font-serif text-2xl font-semibold text-foreground">Student Community</h3>
							<p className="text-sm text-muted-foreground">Peer support and campus groups</p>
						</div>
						<Dialog open={isAddClubOpen} onOpenChange={setIsAddClubOpen}>
							<DialogTrigger asChild>
								<Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary/5">
									<Plus className="size-3.5" />
									Add Group
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle className="font-serif text-xl">Add Campus Group</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleAddClub} className="space-y-4 pt-4">
									<div className="space-y-2">
										<Label htmlFor="clubName">Organization Name</Label>
										<Input
											id="clubName"
											required
											placeholder="e.g. Active Minds Chapter"
											value={clubForm.name}
											onChange={(e) =>
												setClubForm({ ...clubForm, name: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="clubSummary">Summary</Label>
										<Textarea
											id="clubSummary"
											required
											placeholder="What does this group do to support mental health?"
											value={clubForm.summary}
											onChange={(e) =>
												setClubForm({ ...clubForm, summary: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="clubTags">Tags (optional)</Label>
										<Input
											id="clubTags"
											placeholder="e.g. peer-support, weekly-meetings, anxiety"
											value={clubForm.tags}
											onChange={(e) =>
												setClubForm({ ...clubForm, tags: e.target.value })
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="clubLinks">Links (optional)</Label>
										<Input
											id="clubLinks"
											placeholder="e.g. instagram.com/ourclub"
											value={clubForm.links}
											onChange={(e) =>
												setClubForm({ ...clubForm, links: e.target.value })
											}
										/>
									</div>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full btn-playful"
									>
										{isSubmitting && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Submit Group
									</Button>
								</form>
							</DialogContent>
						</Dialog>
					</div>

					{school.clubs && school.clubs.length > 0 ? (
						<div className="grid gap-3">
							{school.clubs.map((c: SchoolClub) => (
								<div
									key={c.id}
									className="card-glass flex flex-col gap-3 p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/25"
								>
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-semibold text-foreground leading-tight">{c.name}</h4>
										<span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap bg-muted/30 px-2 py-0.5 rounded-full">
											{formatDistanceToNow(new Date(c.createdAt), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{c.summary}
									</p>

									{(c.tags || c.links) && (
										<div className="flex flex-wrap items-center gap-2 mt-1 pt-3 border-t border-border/40">
											{c.tags
													?.split(",")
													.map((tag) => tag.trim())
													.filter(Boolean)
													.map((tag) => (
														<span
															key={tag}
															className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 border border-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary"
														>
															<Tags className="size-3" />
															{tag}
														</span>
													))}
											{c.links
													?.split(",")
													.map((link) => link.trim())
													.filter(Boolean)
													.map((link, idx) => (
														<a
															key={link + idx.toString()}
															href={
																link.startsWith("http")
																	? link
																	: `https://${link}`
															}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-1.5 rounded-full text-primary bg-primary/5 hover:bg-primary/10 px-2 py-0.5 text-[10px] font-semibold transition-colors border border-primary/10"
														>
															<ExternalLink className="size-3" />
															Link
														</a>
													))}
										</div>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground italic bg-muted/15 rounded-2xl p-8 border border-dashed text-center">
							No campus groups added yet. Be the first to share one!
						</p>
					)}
				</motion.div>
			</motion.div>
		</div>
	);
}
