"use client";

import { getMySchool, updateMySchool } from "@/lib/client/school-client";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { colleges, schools, universities } from "@/lib/data";
import type { School } from "@/lib/types";
import { GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SchoolSettings() {
	const [activeTab, setActiveTab] = useState("universities");
	const [selectedSchool, setSelectedSchool] = useState<string>("");
	const [currentSchool, setCurrentSchool] = useState<School | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const fetchCurrent = async () => {
			setIsLoading(true);
			const res = await getMySchool();
			if (res.isSuccess && res.data) {
				setCurrentSchool(res.data);
				setSelectedSchool(res.data.name || "");

				const isInUniversities = universities.some(
					(u) => u.name === res.data!.name,
				);
				if (!isInUniversities) {
					setActiveTab("colleges");
				}
			}
			setIsLoading(false);
		};
		fetchCurrent();
	}, []);

	const handleSave = async () => {
		if (!selectedSchool) return;

		setIsSaving(true);
		const schoolObj = schools.find((s) => s.name === selectedSchool);

		if (!schoolObj) {
			toast.error("Invalid school selected");
			setIsSaving(false);
			return;
		}

		const res = await updateMySchool({
			name: schoolObj.name!,
			countryCode: schoolObj.countryCode,
			regionCode: schoolObj.regionCode,
			city: schoolObj.city,
		});
		if (res.isSuccess && res.data) {
			toast.success("School updated successfully.");
			setCurrentSchool(res.data);
		} else {
			toast.error(res.message || "Failed to update school.");
		}
		setIsSaving(false);
	};

  console.log(currentSchool)

	const matchedSchool = currentSchool ? schools.find((s) => s.name === currentSchool.name) : null;
	const displayLogo = matchedSchool?.logo;

	return (
		<div className="space-y-4">
			{isLoading ? (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" /> Loading current
					school...
				</div>
			) : (
				<div className="space-y-3">
					<div className="flex items-center gap-3 rounded-lg border bg-card p-4">
						{displayLogo ? (
							<img src={displayLogo} alt="" className="h-10 w-auto object-contain rounded-md bg-white shrink-0" />
						) : (
							<div className="flex size-10 items-center justify-center rounded-md bg-primary/10 shrink-0">
								<GraduationCap className="size-5 text-primary" />
							</div>
						)}
						<div className="flex-1 space-y-1">
							<p className="font-medium leading-none">
								{currentSchool ? currentSchool.name : "No school linked"}
							</p>
							<p className="text-sm text-muted-foreground">
								{currentSchool
									? `${currentSchool.city}, ${currentSchool.regionCode}`
									: "Select a school below"}
							</p>
						</div>
					</div>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full max-w-md pt-4"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="universities">Universities</TabsTrigger>
							<TabsTrigger value="colleges">Colleges</TabsTrigger>
						</TabsList>

						<TabsContent value="universities" className="mt-4">
							<Select
								value={selectedSchool}
								onValueChange={setSelectedSchool}
							>
								<SelectTrigger className="w-full bg-background border-input">
									<SelectValue placeholder="Select University" />
								</SelectTrigger>
								<SelectContent>
									{universities.map(({ name, logo }) => (
										<SelectItem key={name} value={name!}>
											<div className="flex items-center gap-2">
												{logo && <img src={logo} alt="" className="w-5 h-5 object-contain" />}
												<span>{name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</TabsContent>

						<TabsContent value="colleges" className="mt-4">
							<Select
								value={selectedSchool}
								onValueChange={setSelectedSchool}
							>
								<SelectTrigger className="w-full bg-background border-input">
									<SelectValue placeholder="Select College" />
								</SelectTrigger>
								<SelectContent>
									{colleges.map(({ name, logo }) => (
										<SelectItem key={name} value={name!}>
											<div className="flex items-center gap-2">
												{logo && <img src={logo} alt="" className="w-5 h-5 object-contain" />}
												<span>{name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</TabsContent>
					</Tabs>

					<Button
						onClick={handleSave}
						disabled={
							isSaving ||
							selectedSchool === currentSchool?.name ||
							!selectedSchool
						}
						className="mt-4"
					>
						{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{selectedSchool === currentSchool?.name && currentSchool
							? "Current School"
							: "Update School"}
					</Button>
				</div>
			)}
		</div>
	);
}
