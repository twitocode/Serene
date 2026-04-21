"use client";

import type { InstantiateSchoolRequest } from "@/lib/client/school-client";
import {
  addSchoolResource,
  deleteSchoolResource,
  getAllSchools,
  instantiateSchool,
} from "@/lib/client/school-client";
import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { schools as predefinedSchools } from "@/lib/data";
import type { School, SchoolResource } from "@/lib/types";
import {
  Add,
  ExportSquare,
  Buildings as SchoolIcon,
  Teacher,
  Trash
} from "iconsax-reactjs";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function AdminSchoolsPage() {
	const [dbSchools, setDbSchools] = useState<School[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
	const [isSubmittingResource, setIsSubmittingResource] = useState(false);

	const [resourceForm, setResourceForm] = useState({
		name: "",
		url: "",
		type: "Counseling",
	});

	const fetchSchools = useCallback(async () => {
		setIsLoading(true);
		const res = await getAllSchools();
		if (res.isSuccess && res.data) {
			setDbSchools(res.data);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchSchools();
	}, [fetchSchools]);

	const availableToInstantiate = predefinedSchools.filter(
		(ps) => !dbSchools.some((ds) => ds.name === ps.name),
	);

	const getSchoolLogo = (schoolName: string | null) => {
		if (!schoolName) return null;
		return predefinedSchools.find((s) => s.name === schoolName)?.logo;
	};

	const handleInstantiate = async (
		schoolTemplate: (typeof predefinedSchools)[0],
	) => {
		const loadingToast = toast.loading(
			`Instantiating ${schoolTemplate.name}...`,
		);
		const res = await instantiateSchool(
			schoolTemplate as InstantiateSchoolRequest,
		);
		if (res.isSuccess && res.data) {
			toast.success(`${schoolTemplate.name} successfully instantiated!`, {
				id: loadingToast,
			});
			setDbSchools((prev) => [...prev, res.data!]);
		} else {
			toast.error(res.message || "Failed to instantiate school", {
				id: loadingToast,
			});
		}
	};

	const handleAddResource = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedSchool) return;

		setIsSubmittingResource(true);
		const res = await addSchoolResource(selectedSchool.id, resourceForm);
		if (res.isSuccess && res.data) {
			toast.success("Resource added!");
			setResourceForm({ name: "", url: "", type: "Counseling" });
			setIsAddResourceOpen(false);
			setDbSchools((prev) =>
				prev.map((s) => {
					if (s.id === selectedSchool.id) {
						return {
							...s,
							resources: [res.data!, ...(s.resources || [])],
						};
					}
					return s;
				}),
			);
			setSelectedSchool((prev) =>
				prev
					? { ...prev, resources: [res.data!, ...(prev.resources || [])] }
					: prev,
			);
		} else {
			toast.error(res.message || "Failed to add resource");
		}
		setIsSubmittingResource(false);
	};

	const handleDeleteResource = async (resourceId: string) => {
		const res = await deleteSchoolResource(resourceId);
		if (res.isSuccess) {
			toast.success("Resource deleted");
			setDbSchools((prev) =>
				prev.map((s) => ({
					...s,
					resources: (s.resources || []).filter((r) => r.id !== resourceId),
				})),
			);
			setSelectedSchool((prev) =>
				prev
					? {
							...prev,
							resources: (prev.resources || []).filter(
								(r) => r.id !== resourceId,
							),
						}
					: prev,
			);
		} else {
			toast.error(res.message || "Failed to delete resource");
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary/60" />
			</div>
		);
	}

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
						<SchoolIcon variant="Bulk" size={16} color="currentColor" />
					</div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						Management
					</p>
				</motion.div>
				<motion.h1
					variants={stagger.item}
					className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
				>
					School Management
				</motion.h1>
			</motion.div>

			<div className="space-y-4">
				<motion.h2
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="font-serif text-xl font-semibold text-foreground"
				>
					Active Schools ({dbSchools.length})
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="grid gap-4"
				>
					{dbSchools.map((school) => {
						const logo = school.logo || getSchoolLogo(school.name);
						return (
							<div
								key={school.id}
								className="card-glass p-5 space-y-4 shadow-sm"
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4">
										{logo ? (
											<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-border/50">
												<Image
													src={logo}
													alt={school.name || "School logo"}
													width={56}
													height={56}
													className="h-full w-full object-contain"
												/>
											</div>
										) : (
											<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
												<Teacher variant="Bulk" size={28} color="currentColor" />
											</div>
										)}
										<div>
											<h3 className="font-semibold text-lg text-foreground leading-none mb-1.5">
												{school.name}
											</h3>
											<div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
												<span>
													{school.city}, {school.regionCode}
												</span>
												<span className="size-1 rounded-full bg-border" />
												<span>{(school.resources || []).length} resources</span>
												<span className="size-1 rounded-full bg-border" />
												<span>{(school.clubs || []).length} clubs</span>
											</div>
										</div>
									</div>
									<Button
										size="sm"
										variant="outline"
										className="rounded-full px-4 h-9 font-medium"
										onClick={() => {
											setSelectedSchool(school);
											setIsAddResourceOpen(true);
										}}
									>
										<Add variant="Bulk" size={14} color="currentColor" className="mr-1.5" />
										Add Resource
									</Button>
								</div>

								{school.resources && school.resources.length > 0 && (
									<div className="grid gap-2 pt-2 border-t border-sidebar-border/40">
										{school.resources.map((r: SchoolResource) => (
											<div
												key={r.id}
												className="flex items-center justify-between rounded-xl p-3 bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors group"
											>
												<div className="flex items-center gap-3">
													<span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
														{r.type}
													</span>
													<span className="text-sm font-medium text-foreground">
														{r.name}
													</span>
													<a
														href={r.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-muted-foreground hover:text-primary transition-colors"
													>
														<ExportSquare variant="Outline" size={14} color="currentColor" />
													</a>
												</div>
												<Button
													size="sm"
													variant="ghost"
													className="text-muted-foreground hover:text-destructive h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => handleDeleteResource(r.id)}
												>
													<Trash variant="Bulk" size={16} color="currentColor" />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</motion.div>
			</div>

			{availableToInstantiate.length > 0 && (
				<div className="space-y-4">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="font-serif text-xl font-semibold text-foreground"
					>
						Available to Instantiate ({availableToInstantiate.length})
					</motion.h2>
					<motion.div
						variants={stagger.container}
						initial="initial"
						animate="animate"
						className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
					>
						{availableToInstantiate.map((s) => (
							<motion.div
								variants={stagger.item}
								key={s.name}
								className="card-glass flex items-center justify-between p-4"
							>
								<div className="flex items-center gap-3 min-w-0">
									{s.logo ? (
										<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-border/50">
											<Image
												src={s.logo}
												alt={s.name ?? "School Logo"}
												width={40}
												height={40}
												className="h-full w-full object-contain"
											/>
										</div>
									) : (
										<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary/40 shadow-inner">
											<Teacher variant="Bulk" size={20} color="currentColor" />
										</div>
									)}
									<div className="min-w-0">
										<p className="truncate font-medium text-sm text-foreground">
											{s.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{s.city}, {s.regionCode}
										</p>
									</div>
								</div>
								<Button
									size="sm"
									variant="ghost"
									className="text-primary hover:bg-primary/10 hover:text-primary transition-colors"
									onClick={() => handleInstantiate(s)}
								>
									<Add variant="Bulk" size={16} color="currentColor" />
								</Button>
							</motion.div>
						))}
					</motion.div>
				</div>
			)}

			<Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
				<DialogContent className="sm:max-w-[425px] card-glass border-none shadow-2xl">
					<DialogHeader>
						<DialogTitle className="font-serif text-2xl">
							Add Resource to {selectedSchool?.name}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddResource} className="space-y-5 pt-4">
						<div className="space-y-2">
							<Label
								htmlFor="resourceName"
								className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Resource Name
							</Label>
							<Input
								id="resourceName"
								required
								className="rounded-xl bg-sidebar-accent/50"
								placeholder="e.g. Counseling Services"
								value={resourceForm.name}
								onChange={(e) =>
									setResourceForm({ ...resourceForm, name: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="resourceUrl"
								className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
							>
								URL
							</Label>
							<Input
								id="resourceUrl"
								required
								className="rounded-xl bg-sidebar-accent/50"
								placeholder="https://..."
								value={resourceForm.url}
								onChange={(e) =>
									setResourceForm({ ...resourceForm, url: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="resourceType"
								className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Type
							</Label>
							<Select
								value={resourceForm.type}
								onValueChange={(value) =>
									setResourceForm({ ...resourceForm, type: value })
								}
							>
								<SelectTrigger className="rounded-xl bg-sidebar-accent/50">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="card-glass border-none shadow-xl">
									<SelectItem value="Counseling">Counseling</SelectItem>
									<SelectItem value="Crisis">Crisis</SelectItem>
									<SelectItem value="Wellness">Wellness</SelectItem>
									<SelectItem value="Peer Support">Peer Support</SelectItem>
									<SelectItem value="Website">Website</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							type="submit"
							disabled={isSubmittingResource}
							className="w-full btn-playful h-11"
						>
							{isSubmittingResource && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Add Resource
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
