"use client";

import { Moneys, Moon, Sun1 } from "iconsax-reactjs";
import { Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import {
	useSettingsQuery,
	useUpdateSettingsMutation,
} from "@/lib/hooks/queries/use-settings";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const updateSettings = useUpdateSettingsMutation();
	const { data: settings } = useSettingsQuery();

	useEffect(() => {
		setMounted(true);
	}, []);

	const changeTheme = async (newTheme: "Light" | "Dark" | "System") => {
		try {
			await updateSettings.mutateAsync({ theme: newTheme.toLowerCase() });
			setTheme(newTheme.toLowerCase());
			toast.success(`Theme changed to ${newTheme}`);
		} catch {
			setTheme(settings?.theme.toLowerCase() ?? "light");
			toast.error("Could not change your theme for some reason");
		}
	};

	if (!mounted) {
		return (
			<Button variant="outline" size="icon-sm" className="rounded-full">
				<Sun1 variant="Bulk" size={16} color="currentColor" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	const Icon = theme === "dark" ? Moon : theme === "system" ? Laptop : Sun1;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon-sm" className="rounded-full">
					<Icon variant="Bulk" size={16} color="currentColor" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => changeTheme("Light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeTheme("Dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeTheme("System")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
