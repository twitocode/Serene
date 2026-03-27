export const SAVORING_PROMPTS = [
  "Close your eyes for 5 seconds and replay the best moment of this activity.",
  "What's one small detail about this experience you want to remember?",
  "How did your body feel during the best part?",
  "Who would you tell about this, and what would you say?",
  "Imagine bottling this feeling. What color would it be?",
  "What made this activity feel different from your usual routine?",
  "If you could freeze one moment from this, which would it be?",
  "Take a breath and notice. Is your body more relaxed than before?",
  "What surprised you about how this went?",
  "Picture yourself doing this again next week. How does that feel?",
  "What's one word that captures this experience?",
  "Did anything make you smile, even just a little?",
];

export function getRandomSavoringPrompt(exclude?: string): string {
  const filtered = exclude
    ? SAVORING_PROMPTS.filter((p) => p !== exclude)
    : SAVORING_PROMPTS;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
