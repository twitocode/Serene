"use client";

import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	addContent,
	deleteAllContent,
	type CreateExploreContentRequest,
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
	DialogTrigger,
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

		const res = await populateContent(populateData.query, populateData.count);
		if (res.isSuccess) {
			toast.success(`Successfully populated ${res.data} items`);
			fetchContent();
			setIsPopulateDialogOpen(false);
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
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">
					Content Management
				</h2>
				<div className="flex gap-2">
					<Button
						variant="destructive"
						onClick={() => setIsDeleteAllAlertOpen(true)}
						disabled={content.length === 0}
					>
						<Trash2 className="mr-2 h-4 w-4" /> Delete All
					</Button>
					<Button
						variant="outline"
						onClick={() => setIsPopulateDialogOpen(true)}
					>
						<Search className="mr-2 h-4 w-4" /> Populate from Search
					</Button>
					<Button onClick={openAddDialog}>
						<Plus className="mr-2 h-4 w-4" /> Add Content
					</Button>
				</div>
			</div>

			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading && content.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto" />
								</TableCell>
							</TableRow>
						) : content.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No content found.
								</TableCell>
							</TableRow>
						) : (
							content.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="font-medium max-w-[300px] truncate">
										{item.title}
									</TableCell>
									<TableCell>{item.type}</TableCell>
									<TableCell className="max-w-md truncate">
										{item.description}
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEditDialog(item)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-600"
												onClick={() => {
													setDeletingId(item.id);
													setIsAlertOpen(true);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							{editingItem ? "Edit Content" : "Add Content"}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								required
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="type">Type</Label>
							<Select
								value={formData.type}
								onValueChange={(value: "Article" | "Video") =>
									setFormData({ ...formData, type: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Article">Article</SelectItem>
									<SelectItem value="Video">Video</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="url">URL</Label>
							<div className="flex gap-2">
								<Input
									id="url"
									type="url"
									required
									value={formData.url}
									onChange={(e) =>
										setFormData({ ...formData, url: e.target.value })
									}
									placeholder="https://example.com"
								/>
								<Button
									type="button"
									variant="outline"
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
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								required
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="tags">
								Tags{" "}
								<span className="text-xs text-gray-500">(comma separated)</span>
							</Label>
							<Input
								id="tags"
								value={formData.tags}
								onChange={(e) =>
									setFormData({ ...formData, tags: e.target.value })
								}
								placeholder="anxiety, stress, sleep"
							/>
						</div>
						<div className="flex justify-end pt-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Save
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isPopulateDialogOpen}
				onOpenChange={setIsPopulateDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Populate from Search</DialogTitle>
					</DialogHeader>
					<form onSubmit={handlePopulate} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="struggle">Select Topic (Optional)</Label>
							<Select
								onValueChange={(value) =>
									setPopulateData({ ...populateData, query: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a struggle" />
								</SelectTrigger>
								<SelectContent>
									{STRUGGLES.map((struggle) => (
										<SelectItem key={struggle} value={struggle}>
											{struggle}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="query">Search Query</Label>
							<Input
								id="query"
								required
								value={populateData.query}
								onChange={(e) =>
									setPopulateData({ ...populateData, query: e.target.value })
								}
								placeholder="e.g. mental health resources for students"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="count">Count (Max 10)</Label>
							<Input
								id="count"
								type="number"
								min="1"
								max="10"
								required
								value={populateData.count}
								onChange={(e) =>
									setPopulateData({
										...populateData,
										count: parseInt(e.target.value),
									})
								}
							/>
						</div>
						<div className="flex justify-end pt-4">
							<Button type="submit" disabled={isPopulating}>
								{isPopulating && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Populate
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							content from the database.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
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
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete ALL {" "}
							<span className="font-bold text-foreground">
								{content.length}
							</span>{" "}
							admin content items from the database. Let's hope you know what you're doing.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteAll}
							className="bg-red-600 hover:bg-red-700 font-bold"
						>
							DELETE ALL
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
