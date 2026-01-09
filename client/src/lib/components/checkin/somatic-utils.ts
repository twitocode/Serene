export type BodyPart =
  | "Head"
  | "Chest"
  | "Hips"
  | "Left Arm"
  | "Right Arm"
  | "Left Leg"
  | "Right Leg"
  | "Left Hand"
  | "Right Hand"
  | "Feet"
  | null;

export interface Zone {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export const FEMALE_ZONES: Record<string, Zone[]> = {
  Head: [{ x: 40, y: 0, width: 20, height: 17 }],
  Chest: [{ x: 27, y: 17, width: 48, height: 15 }],
  Hips: [{ x: 32.5, y: 33, width: 35, height: 16 }],
  "Right Arm": [{ x: 5, y: 18, width: 20, height: 35 }],
  "Left Arm": [{ x: 75, y: 18, width: 20, height: 35 }],
  "Right Hand": [{ x: 0, y: 46, width: 20, height: 15 }],
  "Left Hand": [{ x: 80, y: 46, width: 20, height: 15 }],
  "Right Leg": [{ x: 23, y: 50, width: 20, height: 48 }],
  "Left Leg": [{ x: 55, y: 50, width: 20, height: 48 }],
  Feet: [
    { x: 23, y: 92, width: 18, height: 8 },
    { x: 59, y: 92, width: 18, height: 8 },
  ],
};

export const MALE_ZONES: Record<string, Zone[]> = {
  Head: [{ x: 40, y: 0, width: 20, height: 17 }],
  Chest: [{ x: 25, y: 16, width: 50, height: 17 }],
  Hips: [{ x: 27, y: 34, width: 43, height: 15 }],
  "Right Arm": [{ x: 5, y: 18, width: 15, height: 35 }],
  "Left Arm": [{ x: 85, y: 18, width: 20, height: 35 }],
  "Right Hand": [{ x: 0, y: 46, width: 20, height: 15 }],
  "Left Hand": [{ x: 80, y: 46, width: 20, height: 15 }],
  "Right Leg": [{ x: 23, y: 50, width: 20, height: 48 }],
  "Left Leg": [{ x: 55, y: 50, width: 20, height: 48 }],

  Feet: [
    { x: 23, y: 92, width: 18, height: 8 },
    { x: 59, y: 92, width: 18, height: 8 },
  ],
};

export const PRESET_SENSATIONS = [
  "Tension",
  "Pain",
  "Numbness",
  "Tingling",
  "Heat",
  "Cold",
  "Tightness",
  "Ache",
  "Soreness",
  "Cramping",
  "Stiffness",
  "Heaviness",
  "Throbbing",
];

export function getBodyPart(
  x: number,
  y: number,
  gender: string = "Female"
): BodyPart {
  const px = x * 100;
  const py = y * 100;

  const activeZones = gender === "Female" ? FEMALE_ZONES : MALE_ZONES;

  const checkOrder: BodyPart[] = [
    "Head",
    "Feet",
    "Left Hand",
    "Right Hand",
    "Left Arm",
    "Right Arm",
    "Chest",
    "Hips",
    "Left Leg",
    "Right Leg",
  ];

  for (const part of checkOrder) {
    if (!part) continue;
    const zones = activeZones[part];
    if (!zones) continue;

    for (const z of zones) {
      if (
        px >= z.x &&
        px <= z.x + z.width &&
        py >= z.y &&
        py <= z.y + z.height
      ) {
        return part;
      }
    }
  }

  return null;
}