export interface BodyScanStep {
	region: string;
	instruction: string;
	durationMs: number;
}

export const BODY_SCAN_STEPS: BodyScanStep[] = [
	{
		region: "Preparation",
		instruction:
			"Close your eyes. Take three slow, deep breaths. Let your body settle into wherever you're sitting or lying.",
		durationMs: 15000,
	},
	{
		region: "Feet",
		instruction:
			"Bring your attention to the soles of your feet. Notice any warmth, tingling, or pressure. Don't try to change anything. Just observe.",
		durationMs: 12000,
	},
	{
		region: "Lower legs",
		instruction:
			"Move your awareness up to your calves and shins. Notice whatever is there. Tension, heaviness, or nothing at all. All of it is fine.",
		durationMs: 12000,
	},
	{
		region: "Thighs & hips",
		instruction:
			"Let your attention drift to your thighs and hips. Notice the weight of your body pressing into the surface beneath you.",
		durationMs: 12000,
	},
	{
		region: "Abdomen",
		instruction:
			"Bring awareness to your stomach and lower back. Feel the gentle rise and fall of each breath without changing its rhythm.",
		durationMs: 12000,
	},
	{
		region: "Chest",
		instruction:
			"Notice your chest and upper back. Observe the expansion with each inhale, the softening with each exhale.",
		durationMs: 12000,
	},
	{
		region: "Hands & arms",
		instruction:
			"Shift your attention to your fingertips, palms, wrists, and arms. Notice any sensations. Warmth, coolness, or pulsing.",
		durationMs: 12000,
	},
	{
		region: "Shoulders & neck",
		instruction:
			"Move your awareness to your shoulders and neck. These areas often hold stress. Simply notice what's there without trying to release it.",
		durationMs: 12000,
	},
	{
		region: "Face & head",
		instruction:
			"Bring gentle attention to your jaw, cheeks, eyes, and forehead. Let your face soften. Notice the crown of your head.",
		durationMs: 12000,
	},
	{
		region: "Whole body",
		instruction:
			"Expand your awareness to your entire body at once. Hold this feeling of wholeness for a moment. You are here. You are safe.",
		durationMs: 15000,
	},
];

export interface BreathingPhase {
	label: string;
	durationMs: number;
}

export const BOX_BREATHING_CYCLE: BreathingPhase[] = [
	{ label: "Breathe in", durationMs: 4000 },
	{ label: "Hold", durationMs: 4000 },
	{ label: "Breathe out", durationMs: 4000 },
	{ label: "Hold", durationMs: 4000 },
];

export const BREATHING_TOTAL_CYCLES = 4;
