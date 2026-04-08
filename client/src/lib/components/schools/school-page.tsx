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
import { schools } from "@/lib/data";
import type { School, SchoolClub, SchoolResource } from "@/lib/types";

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
		<div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-center gap-4">
					{displayLogo ? (
						<Image
							src={displayLogo}
							alt=""
							width={64}
							height={64}
							className="h-16 w-auto max-w-[200px] sm:max-w-[250px] object-contain rounded-md bg-white shrink-0"
						/>
					) : (
						<div className="flex size-16 items-center justify-center rounded-md bg-primary/10 shrink-0">
							<GraduationCap className="size-8 text-primary" />
						</div>
					)}
					<div className="space-y-1">
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
							{school.name}
						</h2>
						<p className="text-muted-foreground text-sm">
							{school.city}, {school.regionCode} &bull; Your local community
						</p>
					</div>
				</div>
				<Link href="/home/account" className="w-full sm:w-auto">
					<Button
						variant="outline"
						size="sm"
						className="gap-2 w-full sm:w-auto"
					>
						<GraduationCap className="size-4" />
						Switch School
					</Button>
				</Link>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="space-y-4">
					<div className="flex items-center gap-2 border-b pb-2">
						<BookHeart className="size-5 text-primary" />
						<h3 className="text-xl font-semibold">Official Resources</h3>
					</div>

					{school.resources && school.resources.length > 0 ? (
						<div className="grid gap-3">
							{school.resources.map((r: SchoolResource) => (
								<a
									key={r.id}
									href={r.url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
								>
									<div className="flex items-center justify-between">
										<span className="font-semibold">{r.name}</span>
										<ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
									</div>
									<span className="text-sm font-medium text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
										{r.type}
									</span>
								</a>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground italic bg-muted/50 rounded-lg p-4 text-center">
							No official resources listed yet.
						</p>
					)}
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between border-b pb-2">
						<div className="flex items-center gap-2">
							<UsersRound className="size-5 text-indigo-500" />
							<h3 className="text-xl font-semibold">Student Community</h3>
						</div>
						<Dialog open={isAddClubOpen} onOpenChange={setIsAddClubOpen}>
							<DialogTrigger asChild>
								<Button size="sm" variant="outline" className="h-8 gap-1">
									<Plus className="size-3.5" />
									Add Group
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Add Campus Group</DialogTitle>
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
										className="w-full"
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
									className="flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm"
								>
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-semibold leading-none">{c.name}</h4>
										<span className="text-[10px] text-muted-foreground whitespace-nowrap">
											{formatDistanceToNow(new Date(c.createdAt), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm text-muted-foreground mt-1">
										{c.summary}
									</p>

									{(c.tags || c.links) && (
										<div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t">
											{c.tags &&
												c.tags
													.split(",")
													.map((tag) => tag.trim())
													.filter(Boolean)
													.map((tag) => (
														<span
															key={tag}
															className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
														>
															<Tags className="size-3" />
															{tag}
														</span>
													))}
											{c.links &&
												c.links
													.split(",")
													.map((link) => link.trim())
													.filter(Boolean)
													.map((link, idx) => (
														<a
															key={idx}
															href={
																link.startsWith("http")
																	? link
																	: `https://${link}`
															}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center gap-1 rounded text-primary hover:underline px-1 py-0.5 text-[10px] font-medium"
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
						<p className="text-sm text-muted-foreground italic bg-muted/50 rounded-lg p-4 text-center">
							No campus groups added yet. Be the first to share one!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
