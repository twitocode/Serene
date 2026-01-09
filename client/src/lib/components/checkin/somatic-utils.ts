export type BodyPart =
  | "Head"
  | "Chest"
  | "Hips"
  | "Left Arm"
  | "Right Arm"
  | "Left Leg"
  | "Right Leg"
  | "Hands"
  | "Feet"
  | null;

export function getBodyPart(x: number, y: number): BodyPart {
  // x and y are normalized 0-1
  // Assuming facing forward (Anatomical: Screen Left = Body Right)
  if (y < 0.13) {
    if (x > 0.35 && x < 0.65) return "Head";
  }

  if (y > 0.91) {
    return "Feet";
  }

  if (y > 0.46 && y < 0.65) {
    if (x < 0.22 || x > 0.78) return "Hands";
  }

  if (y >= 0.15 && y <= 0.65) {
    if (x > 0.7) return "Left Arm";
    if (x < 0.3) return "Right Arm";
  }

  if (y > 0.5) {
    if (x > 0.5) return "Left Leg";
    else return "Right Leg";
  }

  if (x >= 0.3 && x <= 0.7) {
    if (y >= 0.13 && y < 0.35) return "Chest";
    if (y >= 0.35 && y <= 0.5) return "Hips";
  }

  return null;
}
