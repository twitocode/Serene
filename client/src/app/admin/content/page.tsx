"use client";

import { Add, DocumentText, Edit2, SearchNormal, Trash } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	addContent,
	type CreateExploreContentRequest,
	deleteAllContent,
	deleteContent,
	getAllContent,
	populateContent,
	scrapeContent,
	updateContent,
} from "@/lib/client/admin-client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog";
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
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/lib/components/ui/multi-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/lib/components/ui/table";
import { Textarea } from "@/lib/components/ui/textarea";
import { STRUGGLES } from "@/lib/data";
import type { ExploreContent } from "@/lib/types";

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

export default function ContentAdminPage() {
	const [content, setContent] = useState<ExploreContent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPopulateDialogOpen, setIsPopulateDialogOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<ExploreContent | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [isScraping, setIsScraping] = useState(false);
	const [isPopulating, setIsPopulating] = useState(false);

	const [formData, setFormData] = useState<CreateExploreContentRequest>({
		title: "",
		description: "",
		url: "",
		type: "Article",
		tags: "",
	});

	const [populateData, setPopulateData] = useState({
		query: "",
		selectedTopics: [] as string[],
		count: 10,
	});

	const fetchContent = useCallback(async () => {
		setIsLoading(true);
		const res = await getAllContent();
		if (res.isSuccess && res.data) {
			setContent(res.data);
		} else {
			toast.error("Failed to fetch content");
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchContent();
	}, [fetchContent]);

	const handleScrape = async () => {
		if (!formData.url) {
			toast.error("Please enter a URL first");
			return;
		}

		setIsScraping(true);
		const res = await scrapeContent(formData.url);
		if (res.isSuccess && res.data) {
			setFormData((prev) => ({
				...prev,
				title: res.data!.title || prev.title,
				description: res.data!.description || prev.description,
				type: res.data!.type || prev.type,
			}));
			toast.success("Content scraped successfully");
		} else {
			toast.error("Failed to scrape content");
		}
		setIsScraping(false);
	};

	const handlePopulate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsPopulating(true);

		const textQueries = populateData.query
			.split(/[\n,]+/)
			.map((q) => q.trim())
			.filter((q) => q.length > 0);

		const queries = [
			...new Set([...populateData.selectedTopics, ...textQueries]),
		];

		if (queries.length === 0) {
			toast.error("Please enter at least one query or select a topic");
			setIsPopulating(false);
			return;
		}

		const res = await populateContent(populateData.count, undefined, queries);
		if (res.isSuccess) {
			toast.success(`Successfully populated ${res.data} items`);
			fetchContent();
			setIsPopulateDialogOpen(false);
			setPopulateData({ query: "", selectedTopics: [], count: 10 });
		} else {
			toast.error("Failed to populate content");
		}
		setIsPopulating(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		if (editingItem) {
			const res = await updateContent(editingItem.id, formData);
			if (res.isSuccess) {
				toast.success("Content updated successfully");
				fetchContent();
				setIsDialogOpen(false);
			} else {
				toast.error("Failed to update content");
			}
		} else {
			const res = await addContent(formData);
			if (res.isSuccess) {
				toast.success("Content added successfully");
				fetchContent();
				setIsDialogOpen(false);
			} else {
				toast.error("Failed to add content");
			}
		}
		setIsLoading(false);
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		const res = await deleteContent(deletingId);
		if (res.isSuccess) {
			toast.success("Content deleted successfully");
			fetchContent();
		} else {
			toast.error("Failed to delete content");
		}
		setIsAlertOpen(false);
		setDeletingId(null);
	};

	const handleDeleteAll = async () => {
		const res = await deleteAllContent();
		if (res.isSuccess) {
			toast.success("All content deleted successfully");
			fetchContent();
		} else {
			toast.error("Failed to delete all content");
		}
		setIsDeleteAllAlertOpen(false);
	};

	const openAddDialog = () => {
		setEditingItem(null);
		setFormData({
			title: "",
			description: "",
			url: "",
			type: "Article",
			tags: "",
		});
		setIsDialogOpen(true);
	};

	const openEditDialog = (item: ExploreContent) => {
		setEditingItem(item);
		setFormData({
			title: item.title,
			description: item.description,
			url: item.url,
			type: item.type,
			tags: "", // Tags are not stored in entity plain text, simpler to just require re-entry or keep empty for update if not supported fully
		});
		setIsDialogOpen(true);
	};

	return (
		<div className="relative mx-auto flex min-h-full max-w-6xl flex-col gap-10 px-4 py-6 md:py-10">
			{/* Header */}
			<motion.div
				variants={stagger.container}
				initial="initial"
				animate="animate"
				className="flex flex-col gap-2"
			>
				<motion.div
					variants={stagger.item}
					className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
				>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<DocumentText variant="Bulk" size={16} color="currentColor" />
							</div>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
								Management
							</p>
						</div>
						<h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
							Content Library
						</h1>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							variant="destructive"
							size="sm"
							className="rounded-full h-9 font-medium"
							onClick={() => setIsDeleteAllAlertOpen(true)}
							disabled={content.length === 0}
						>
							<Trash
								variant="Bulk"
								size={16}
								color="currentColor"
								className="mr-2"
							/>{" "}
							Delete All
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="rounded-full h-9 font-medium"
							onClick={() => setIsPopulateDialogOpen(true)}
						>
							<SearchNormal
								variant="Bulk"
								size={16}
								color="currentColor"
								className="mr-2"
							/>{" "}
							Auto-Populate
						</Button>
						<Button
							size="sm"
							className="rounded-full h-9 font-medium btn-playful"
							onClick={openAddDialog}
						>
							<Add
								variant="Bulk"
								size={16}
								color="currentColor"
								className="mr-2"
							/>{" "}
							Add Content
						</Button>
					</div>
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="card-glass overflow-hidden shadow-md"
			>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-sidebar-border/60">
							<TableHead className="font-semibold text-foreground">
								Content
							</TableHead>
							<TableHead className="font-semibold text-foreground">
								Type
							</TableHead>
							<TableHead className="font-semibold text-foreground">
								Description
							</TableHead>
							<TableHead className="w-[100px] font-semibold text-foreground text-right pr-6">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading && content.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-48 text-center">
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<Loader2 className="h-8 w-8 animate-spin" />
										<p className="text-sm font-medium">
											Loading content library...
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : content.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-48 text-center">
									<p className="text-muted-foreground font-medium">
										No content found.
									</p>
								</TableCell>
							</TableRow>
						) : (
							content.map((item) => (
								<TableRow
									key={item.id}
									className="border-sidebar-border/40 hover:bg-sidebar-accent/30 transition-colors"
								>
									<TableCell className="max-w-[300px]">
										<div className="flex flex-col gap-0.5 min-w-0">
											<span className="font-semibold text-foreground truncate">
												{item.title}
											</span>
											<span className="text-[10px] font-mono text-muted-foreground truncate uppercase tracking-tight">
												{item.url}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span
											className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
												item.type === "Article"
													? "text-primary bg-primary/10"
													: "text-warm bg-warm/10"
											}`}
										>
											{item.type}
										</span>
									</TableCell>
									<TableCell className="max-w-md">
										<p className="text-sm text-muted-foreground line-clamp-1">
											{item.description}
										</p>
									</TableCell>
									<TableCell className="text-right pr-4">
										<div className="flex justify-end gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-lg hover:bg-sidebar-accent"
												onClick={() => openEditDialog(item)}
											>
												<Edit2 variant="Bulk" size={14} color="currentColor" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
												onClick={() => {
													setDeletingId(item.id);
													setIsAlertOpen(true);
												}}
											>
												<Trash variant="Bulk" size={14} color="currentColor" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</motion.div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[500px] card-glass border-none shadow-2xl p-0 overflow-hidden">
					<div className="p-6 space-y-6">
						<DialogHeader>
							<h2 className="font-serif text-2xl font-semibold">
								{editingItem ? "Edit Content" : "Add New Content"}
							</h2>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="title"
									className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
								>
									Title
								</Label>
								<Input
									id="title"
									required
									className="rounded-xl bg-sidebar-accent/50 h-11"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="type"
										className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Type
									</Label>
									<Select
										value={formData.type}
										onValueChange={(value: "Article" | "Video") =>
											setFormData({ ...formData, type: value })
										}
									>
										<SelectTrigger className="rounded-xl bg-sidebar-accent/50 h-11">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent className="card-glass border-none shadow-xl">
											<SelectItem value="Article">Article</SelectItem>
											<SelectItem value="Video">Video</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="tags"
										className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Tags
									</Label>
									<Input
										id="tags"
										className="rounded-xl bg-sidebar-accent/50 h-11"
										value={formData.tags}
										onChange={(e) =>
											setFormData({ ...formData, tags: e.target.value })
										}
										placeholder="anxiety, stress..."
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="url"
									className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
								>
									URL
								</Label>
								<div className="flex gap-2">
									<Input
										id="url"
										type="url"
										required
										className="rounded-xl bg-sidebar-accent/50 h-11"
										value={formData.url}
										onChange={(e) =>
											setFormData({ ...formData, url: e.target.value })
										}
										placeholder="https://..."
									/>
									<Button
										type="button"
										variant="secondary"
										className="rounded-xl px-4 h-11 font-medium"
										onClick={handleScrape}
										disabled={isScraping || !formData.url}
									>
										{isScraping ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Auto-fill"
										)}
									</Button>
								</div>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
								>
									Description
								</Label>
								<Textarea
									id="description"
									required
									className="rounded-xl bg-sidebar-accent/50 min-h-[100px] resize-none"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
							</div>
							<div className="flex justify-end pt-2">
								<Button
									type="submit"
									disabled={isLoading}
									className="w-full btn-playful h-11"
								>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{editingItem ? "Update Content" : "Create Content"}
								</Button>
							</div>
						</form>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isPopulateDialogOpen}
				onOpenChange={setIsPopulateDialogOpen}
			>
				<DialogContent className="sm:max-w-[450px] card-glass border-none shadow-2xl p-0 overflow-hidden">
					<div className="p-6 space-y-6">
						<DialogHeader>
							<h2 className="font-serif text-2xl font-semibold">
								Auto-Populate Library
							</h2>
						</DialogHeader>
						<form onSubmit={handlePopulate} className="space-y-5">
							<div className="space-y-2">
								<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Select Topics
								</Label>
								<MultiSelect
									values={populateData.selectedTopics}
									onValuesChange={(values) =>
										setPopulateData({ ...populateData, selectedTopics: values })
									}
								>
									<MultiSelectTrigger className="w-full rounded-xl bg-sidebar-accent/50 min-h-11">
										<MultiSelectValue
											placeholder="Choose struggles..."
											overflowBehavior="wrap"
										/>
									</MultiSelectTrigger>
									<MultiSelectContent className="card-glass border-none shadow-xl max-h-60">
										{STRUGGLES.map((struggle) => (
											<MultiSelectItem key={struggle} value={struggle}>
												{struggle}
											</MultiSelectItem>
										))}
									</MultiSelectContent>
								</MultiSelect>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="query"
									className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
								>
									Additional Search Queries
								</Label>
								<Textarea
									id="query"
									className="rounded-xl bg-sidebar-accent/50 min-h-[80px] resize-none"
									value={populateData.query}
									onChange={(e) =>
										setPopulateData({ ...populateData, query: e.target.value })
									}
									placeholder="e.g. mindfulness exercises for university students"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="count"
									className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
								>
									Items per Query
								</Label>
								<Input
									id="count"
									type="number"
									min="1"
									max="100"
									required
									className="rounded-xl bg-sidebar-accent/50 h-11"
									value={populateData.count}
									onChange={(e) =>
										setPopulateData({
											...populateData,
											count: parseInt(e.target.value),
										})
									}
								/>
							</div>
							<div className="flex justify-end pt-2">
								<Button
									type="submit"
									disabled={isPopulating}
									className="w-full btn-playful h-11"
								>
									{isPopulating && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Populate Content
								</Button>
							</div>
						</form>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent className="card-glass border-none shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-serif text-2xl">
							Remove this content?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground">
							This item will be permanently removed from the student content
							library.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-full">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={isDeleteAllAlertOpen}
				onOpenChange={setIsDeleteAllAlertOpen}
			>
				<AlertDialogContent className="card-glass border-none shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-serif text-2xl text-destructive">
							Wipe Content Library?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground leading-relaxed">
							You are about to delete{" "}
							<span className="font-bold text-foreground underline decoration-destructive">
								{content.length}
							</span>{" "}
							items. This action is destructive and irreversible.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex-col gap-2 sm:flex-row">
						<AlertDialogCancel className="rounded-full">
							Nevermind
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteAll}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full font-bold"
						>
							WIPE ALL DATA
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
