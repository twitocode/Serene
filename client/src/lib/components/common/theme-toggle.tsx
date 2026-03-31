"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
	const { setTheme } = useTheme();
	const updateSettings = useUpdateSettingsMutation();
	const { data: settings } = useSettingsQuery();

	const changeTheme = async (theme: "Light" | "Dark" | "System") => {
		try {
			await updateSettings.mutateAsync({ theme: theme.toLowerCase() });
			setTheme(theme.toLowerCase());
			toast.error(`Theme changed to ${theme}`);
		} catch {
			setTheme(settings?.theme.toLowerCase() ?? "light");
			toast.error("Could not change your theme for some reason");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
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
