export type MoodLabel =
	| "Content"
	| "Zen"
	| "Sad"
	| "Irritated"
	| "Anxious"
	| "Furious"
	| "Tired"
	| "Disgust"
	| "Hyper"
	| "Sick"
	| "Focused"
	| "Confused"
	| "Overwhelmed"
	| "Grateful"
	| "Glitch"
	| "Tank"
	| "Ghost";

export type MoodType = "energy" | "vibe" | "mental" | "status";

export interface Mood {
	label: MoodLabel;
	severity: number;
	type: MoodType;
	//for the companion
	imageUrl: string;
}

export const getMoodTypeColour = (type: MoodType) => {
	const map: Record<MoodType, string> = {
		energy: "yellow",
		vibe: "red",
		mental: "purple",
		status: "teal",
	};

	return map[type];
};

export const getMoodFromLabel = (label: MoodLabel) => {
	return MOODS.find((x) => x.label === label);
};

export const getSeverityColor = (severity: number) => {
	if (severity >= 3)
		return "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900";
	if (severity >= 2)
		return "text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-900";
	return "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900";
};

export const MOODS: Mood[] = [
	{
		label: "Content",
		severity: 1,
		imageUrl: "",
		type: "vibe",
	},
	{
		label: "Zen",
		severity: 1,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Sad",
		severity: 3,
		imageUrl: "",
		type: "vibe",
	},
	{
		label: "Irritated",
		severity: 3,
		imageUrl: "",
		type: "vibe",
	},
	{
		label: "Anxious",
		severity: 3,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Furious",
		severity: 3,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Tired",
		severity: 2,
		imageUrl: "",
		type: "energy",
	},
	{
		label: "Hyper",
		severity: 2,
		imageUrl: "",
		type: "energy",
	},
	{
		label: "Sick",
		severity: 2,
		imageUrl: "",
		type: "energy",
	},

	{
		label: "Focused",
		severity: 1,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Overwhelmed",
		severity: 3,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Grateful",
		severity: 1,
		imageUrl: "",
		type: "mental",
	},
	{
		label: "Glitch",
		severity: 2,
		imageUrl: "",
		type: "status",
	},
	{
		label: "Tank",
		severity: 1,
		imageUrl: "",
		type: "status",
	},
	{
		label: "Ghost",
		severity: 2,
		imageUrl: "",
		type: "status",
	},
];
