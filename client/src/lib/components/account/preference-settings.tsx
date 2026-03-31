"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import { Label } from "@/lib/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/lib/components/ui/radio-group";
import {
	useSettingsQuery,
	useUpdateSettingsMutation,
} from "@/lib/hooks/queries/use-settings";

export function PreferenceSettings() {
	const { data: settings, isLoading: settingsLoading } = useSettingsQuery();
	const updateSettings = useUpdateSettingsMutation();
	const { setTheme } = useTheme();

	if (settingsLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<Card className="card-organic border-0 shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-xl">Appearance</CardTitle>
				<CardDescription>Customize how Serene looks and feels</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div>
						<h3 className="text-sm font-medium mb-3">Theme</h3>
						<RadioGroup
							value={settings?.theme ?? "light"}
							onValueChange={async (value) => {
								try {
									await updateSettings.mutateAsync({ theme: value });
									toast.success(`Theme changed to ${value}`);
									setTheme(value.toLowerCase());
								} catch (_error) {
									setTheme(settings?.theme ?? "light");

									toast.error("Could not change your theme for some reason");
								}
							}}
							className="grid grid-cols-3 gap-4 max-w-md"
						>
							<div>
								<RadioGroupItem
									value="Light"
									id="theme-light"
									className="peer sr-only"
								/>
								<Label
									htmlFor="theme-light"
									className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
								>
									<div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-200 mb-2" />
									<span className="text-sm font-medium">Light</span>
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="Dark"
									id="theme-dark"
									className="peer sr-only"
								/>
								<Label
									htmlFor="theme-dark"
									className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
								>
									<div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 mb-2" />
									<span className="text-sm font-medium">Dark</span>
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="System"
									id="theme-system"
									className="peer sr-only"
								/>
								<Label
									htmlFor="theme-system"
									className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
								>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-slate-800 border-2 border-muted mb-2" />
									<span className="text-sm font-medium">System</span>
								</Label>
							</div>
						</RadioGroup>
						<p className="text-sm text-muted-foreground mt-3">
							Choose how Serene appears to you. Select System to match your
							device settings.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
