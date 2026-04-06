"use client";

import { useEffect, useState } from "react";
import {
	getAllSchools,
	instantiateSchool,
	addSchoolResource,
	deleteSchoolResource,
} from "@/lib/client/school-client";
import type { InstantiateSchoolRequest } from "@/lib/client/school-client";
import type { School, SchoolResource } from "@/lib/types";
import { schools as predefinedSchools } from "@/lib/data";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/lib/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/ui/select";
import {
	Loader2,
	Plus,
	Trash2,
	ExternalLink,
	GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

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

	const fetchSchools = async () => {
		setIsLoading(true);
		const res = await getAllSchools();
		if (res.isSuccess && res.data) {
			setDbSchools(res.data);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchSchools();
	}, []);

	const availableToInstantiate = predefinedSchools.filter(
		(ps) => !dbSchools.some((ds) => ds.name === ps.name),
	);

	const handleInstantiate = async (
		schoolTemplate: (typeof predefinedSchools)[0],
	) => {
		const loadingToast = toast.loading(`Instantiating ${schoolTemplate.name}...`);
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
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold">School Management</h1>
				<p className="text-gray-500 text-sm mt-1">
					Instantiate schools and manage their official resources.
				</p>
			</div>

			{availableToInstantiate.length > 0 && (
				<div className="space-y-3">
					<h2 className="text-lg font-semibold">
						Available to Instantiate ({availableToInstantiate.length})
					</h2>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{availableToInstantiate.map((s) => (
							<div
								key={s.name}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div>
									<p className="font-medium text-sm">{s.name}</p>
									<p className="text-xs text-gray-500">
										{s.city}, {s.regionCode}
									</p>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleInstantiate(s)}
								>
									<Plus className="size-3.5 mr-1" />
									Create
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="space-y-3">
				<h2 className="text-lg font-semibold">
					Active Schools ({dbSchools.length})
				</h2>
				<div className="grid gap-3">
					{dbSchools.map((school) => (
						<div
							key={school.id}
							className="rounded-lg border bg-white p-4 space-y-3"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-blue-50">
										<GraduationCap className="size-5 text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold">{school.name}</h3>
										<p className="text-xs text-gray-500">
											{school.city}, {school.regionCode} &bull;{" "}
											{(school.resources || []).length} resources &bull;{" "}
											{(school.clubs || []).length} clubs
										</p>
									</div>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										setSelectedSchool(school);
										setIsAddResourceOpen(true);
									}}
								>
									<Plus className="size-3.5 mr-1" />
									Add Resource
								</Button>
							</div>

							{school.resources && school.resources.length > 0 && (
								<div className="border-t pt-3 space-y-2">
									{school.resources.map((r: SchoolResource) => (
										<div
											key={r.id}
											className="flex items-center justify-between rounded p-2 bg-gray-50"
										>
											<div className="flex items-center gap-2">
												<span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
													{r.type}
												</span>
												<span className="text-sm font-medium">{r.name}</span>
												<a
													href={r.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-gray-400 hover:text-blue-600"
												>
													<ExternalLink className="size-3.5" />
												</a>
											</div>
											<Button
												size="sm"
												variant="ghost"
												className="text-red-500 hover:text-red-700 h-7 px-2"
												onClick={() => handleDeleteResource(r.id)}
											>
												<Trash2 className="size-3.5" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							Add Resource to {selectedSchool?.name}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddResource} className="space-y-4 pt-4">
						<div className="space-y-2">
							<Label htmlFor="resourceName">Resource Name</Label>
							<Input
								id="resourceName"
								required
								placeholder="e.g. Counseling Services"
								value={resourceForm.name}
								onChange={(e) =>
									setResourceForm({ ...resourceForm, name: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="resourceUrl">URL</Label>
							<Input
								id="resourceUrl"
								required
								placeholder="https://..."
								value={resourceForm.url}
								onChange={(e) =>
									setResourceForm({ ...resourceForm, url: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="resourceType">Type</Label>
							<Select
								value={resourceForm.type}
								onValueChange={(value) =>
									setResourceForm({ ...resourceForm, type: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
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
							className="w-full"
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
