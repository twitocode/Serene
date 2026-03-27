/** Short, sincere encouragements. Shown randomly; no API or tokens. */
export const MOCHI_WHISPERS: string[] = [
  "You're doing better than you think.",
  "You don't have to earn rest. Rest is part of being human.",
  "Small steps still count as forward.",
  "However today felt, you're still here. That matters.",
  "Breathe. You can go at your own pace.",
  "Being gentle with yourself is a skill. You're practicing it.",
  "Showing up, even quietly, is brave.",
  "It's okay if all you did today was get through it.",
  "Your feelings make sense, even when they're loud.",
  "You deserve kindness, especially from yourself.",
  "Nothing about you needs to be 'fixed' for you to deserve care.",
  "Progress isn't always visible. It still happens.",
  "You can pause. The world can wait a moment.",
  "Asking for help is strength, not weakness.",
  "This moment will pass. You don't have to rush it.",
  "You're allowed to be proud of tiny wins.",
  "Softness is not weakness. It's wisdom.",
  "One breath at a time is a whole strategy.",
];

export function pickMochiWhisper(previous?: string): string {
  if (MOCHI_WHISPERS.length === 0) return "";
  let next = MOCHI_WHISPERS[Math.floor(Math.random() * MOCHI_WHISPERS.length)]!;
  if (MOCHI_WHISPERS.length > 1 && next === previous) {
    const i = MOCHI_WHISPERS.indexOf(next);
    next = MOCHI_WHISPERS[(i + 1) % MOCHI_WHISPERS.length]!;
  }
  return next;
}
