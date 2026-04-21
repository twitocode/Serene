"use client";

import { Teacher, TickCircle } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

export function SchoolSettings() {
	const [currentSchool, setCurrentSchool] = useState<School | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCurrent = async () => {
			setIsLoading(true);
			const res = await getMySchool();
			if (res.isSuccess && res.data) {
				setCurrentSchool(res.data);
			}
			setIsLoading(false);
		};
		fetchCurrent();
	}, []);

	const matchedSchool = currentSchool
		? schools.find((s) => s.name === currentSchool.name)
		: null;
	const displayLogo = matchedSchool?.logo;

	return (
		<div className="space-y-4">
			{isLoading ? (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" /> Loading current school...
				</div>
			) : (
				<div className="space-y-3">
					<div className="flex items-center gap-3 rounded-lg border bg-card p-4">
						{displayLogo ? (
							<Image
								src={displayLogo}
								alt=""
								width={40}
								height={40}
								className="h-10 w-auto object-contain rounded-md bg-white shrink-0"
							/>
						) : (
							<div className="flex size-10 items-center justify-center rounded-md bg-primary/10 shrink-0">
								<Teacher variant="Bulk" size={20} color="currentColor" />
							</div>
						)}
						<div className="flex-1 space-y-1">
							<p className="font-medium leading-none">
								{currentSchool ? currentSchool.name : "No school linked"}
							</p>
							<p className="text-sm text-muted-foreground">
								{currentSchool
									? `${currentSchool.city}, ${currentSchool.regionCode}`
									: "Visit the health hub to learn more."}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
