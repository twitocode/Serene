"use client";

import { Loader2 } from "lucide-react";
import { TickCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import { STRUGGLES } from "@/lib/data";
import {
	useUpdateProfileMutation,
	useUserQuery,
} from "@/lib/hooks/queries/use-user";
import { cn } from "@/lib/utils";

export function StrugglesSettings() {
	const { data: user } = useUserQuery();
	const updateProfile = useUpdateProfileMutation();
	const currentStruggles = user?.profile?.struggles ?? [];
	const [selected, setSelected] = useState<string[]>(currentStruggles);

	useEffect(() => {
		if (user?.profile?.struggles) {
			setSelected(user.profile.struggles);
		}
	}, [user?.profile?.struggles]);

	const hasChanges =
		selected.length !== currentStruggles.length ||
		selected.some((s) => !currentStruggles.includes(s));

	const toggle = (struggle: string) => {
		setSelected((prev) =>
			prev.includes(struggle)
				? prev.filter((s) => s !== struggle)
				: [...prev, struggle],
		);
	};

	const handleSave = async () => {
		try {
			await updateProfile.mutateAsync({ struggles: selected });
			toast.success("Struggles updated successfully!");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update struggles",
			);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{STRUGGLES.map((struggle) => {
					const isSelected = selected.includes(struggle);
					return (
						<button
							key={struggle}
							type="button"
							onClick={() => toggle(struggle)}
							className={cn(
								"px-3 py-1.5 rounded-full border transition-colors text-sm",
								isSelected
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-foreground border-border hover:border-primary/50",
							)}
						>
							{struggle}
						</button>
					);
				})}
			</div>
			<Button
				onClick={handleSave}
				disabled={!hasChanges || updateProfile.isPending}
				className="btn-playful"
			>
				{updateProfile.isPending ? (
					<>
						<Loader2 className="size-4 mr-2 animate-spin" />
						Saving...
					</>
				) : (
					<>
						<TickCircle variant="Outline" size={16} color="currentColor" />
						Save Changes
					</>
				)}
			</Button>
		</div>
	);
}
