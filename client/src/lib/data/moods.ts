export interface Mood {
  label: string;
  type: "Joy" | "Anger" | "Sadness" | "Calm" | "Fear" | "Fatigue" | "Neutral";

  bgColour: string;
  typeColour: string;
  intensity: number;
  //TODO: add animated image
}
export const MOODS: Mood[] = [
  // --- JOY (Yellow - Bright & Warm) ---
  {
    label: "Ecstatic",
    type: "Joy",
    bgColour: "bg-yellow-400",
    typeColour: "bg-yellow-200",
    intensity: 9,
  },
  {
    label: "Excited",
    type: "Joy",
    bgColour: "bg-yellow-300",
    typeColour: "bg-yellow-100",
    intensity: 8,
  },
  {
    label: "Happy",
    type: "Joy",
    bgColour: "bg-yellow-200",
    typeColour: "bg-yellow-100",
    intensity: 6,
  },
  {
    label: "Content",
    type: "Joy",
    bgColour: "bg-yellow-100",
    typeColour: "bg-yellow-50",
    intensity: 4,
  },

  // --- ANGER (Rose - Sharp & Intense) ---
  {
    label: "Rage",
    type: "Anger",
    bgColour: "bg-rose-600",
    typeColour: "bg-rose-300",
    intensity: 10,
  },
  {
    label: "Furious",
    type: "Anger",
    bgColour: "bg-rose-500",
    typeColour: "bg-rose-200",
    intensity: 9,
  },
  {
    label: "Frustrated",
    type: "Anger",
    bgColour: "bg-rose-400",
    typeColour: "bg-rose-200",
    intensity: 7,
  },
  {
    label: "Irritated",
    type: "Anger",
    bgColour: "bg-rose-300",
    typeColour: "bg-rose-100",
    intensity: 4,
  },

  // --- SADNESS (Indigo - Deep & Moody) ---
  {
    label: "Grief",
    type: "Sadness",
    bgColour: "bg-indigo-500",
    typeColour: "bg-indigo-200",
    intensity: 10,
  },
  {
    label: "Depressed",
    type: "Sadness",
    bgColour: "bg-indigo-400",
    typeColour: "bg-indigo-200",
    intensity: 8,
  },
  {
    label: "Sad",
    type: "Sadness",
    bgColour: "bg-indigo-300",
    typeColour: "bg-indigo-100",
    intensity: 5,
  },
  {
    label: "Disappointed",
    type: "Sadness",
    bgColour: "bg-indigo-100",
    typeColour: "bg-indigo-50",
    intensity: 3,
  },

  // --- CALM (Teal - Cool & Soothing) ---
  {
    label: "Serene",
    type: "Calm",
    bgColour: "bg-teal-300",
    typeColour: "bg-teal-100",
    intensity: 7,
  },
  {
    label: "Relaxed",
    type: "Calm",
    bgColour: "bg-teal-200",
    typeColour: "bg-teal-100",
    intensity: 5,
  },
  {
    label: "Calm",
    type: "Calm",
    bgColour: "bg-teal-100",
    typeColour: "bg-teal-50",
    intensity: 3,
  },
  {
    label: "Peaceful",
    type: "Calm",
    bgColour: "bg-teal-50",
    typeColour: "bg-white",
    intensity: 2,
  },

  // --- FEAR (Violet - Nervous & Distinct) ---
  {
    label: "Panic",
    type: "Fear",
    bgColour: "bg-violet-500",
    typeColour: "bg-violet-200",
    intensity: 10,
  },
  {
    label: "Terrified",
    type: "Fear",
    bgColour: "bg-violet-400",
    typeColour: "bg-violet-200",
    intensity: 9,
  },
  {
    label: "Anxious",
    type: "Fear",
    bgColour: "bg-violet-300",
    typeColour: "bg-violet-100",
    intensity: 6,
  },
  {
    label: "Apprehensive",
    type: "Fear",
    bgColour: "bg-violet-100",
    typeColour: "bg-violet-50",
    intensity: 3,
  },

  // --- FATIGUE (Slate - Grey/Blue) ---
  {
    label: "Exhausted",
    type: "Fatigue",
    bgColour: "bg-slate-500",
    typeColour: "bg-slate-300",
    intensity: 9,
  },
  {
    label: "Burned Out",
    type: "Fatigue",
    bgColour: "bg-slate-400",
    typeColour: "bg-slate-300",
    intensity: 7,
  },
  {
    label: "Tired",
    type: "Fatigue",
    bgColour: "bg-slate-300",
    typeColour: "bg-slate-200",
    intensity: 4,
  },
  {
    label: "Drowsy",
    type: "Fatigue",
    bgColour: "bg-slate-200",
    typeColour: "bg-slate-100",
    intensity: 2,
  },

  // --- NEUTRAL ---
  {
    label: "Neutral",
    type: "Neutral",
    bgColour: "bg-gray-200",
    typeColour: "bg-gray-100",
    intensity: 1,
  },
];
