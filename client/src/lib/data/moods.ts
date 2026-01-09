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

export const MOODS: Mood[] = [
  {
    label: "Content",
    severity: 0,
    imageUrl: "",
    type: "vibe",
  },
  {
    label: "Zen",
    severity: 0,
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
    severity: 2,
    imageUrl: "",
    type: "mental",
  },
  {
    label: "Overwhelmed",
    severity: 2,
    imageUrl: "",
    type: "mental",
  },
  {
    label: "Grateful",
    severity: 2,
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
    severity: 2,
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
