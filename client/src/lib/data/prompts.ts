interface Prompt {
  question: string;
}

export const getRandomPrompt = (exclude?: string) => {
  let prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  
  if (exclude && PROMPTS.length > 1) {
    let attempts = 0;
    while (prompt.question === exclude && attempts < 50) {
      prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
      attempts++;
    }
  }
  
  return prompt;
}

export const PROMPTS: Prompt[] = [
  {
    question:
      "If you stepped away from your current to-do list for just 10 minutes, what would your brain actually want to do?",
  },
  {
    question:
      "Scan your body right now: where are you holding onto 'deadline tension'—your jaw, shoulders, or hands?",
  },
  {
    question:
      "If a friend was feeling as overwhelmed as you might be right now, what's the first kind thing you’d say to them?",
  },
  {
    question:
      "Looking back at this semester three years from now, will this specific week feel like a mountain or a molehill?",
  },
  {
    question:
      "When was the last time you had a full glass of water or a real meal that didn't come out of a vending machine?",
  },
  {
    question:
      "What is one thing you’ve learned this week that actually interested you, regardless of the grade?",
  },
  {
    question:
      "Your 'social battery'—is it currently in the green, yellow, or red?",
  },
  {
    question:
      "What is one 'non-academic' skill you've used today, like patience, humor, or resilience?",
  },
  {
    question: "How many hours of 'screens-off' time have you had today?",
  },
  {
    question:
      "What is one thing you 'got done' today, even if it wasn't on your official list?",
  },
  {
    question:
      "If you could delete one item from your to-do list today with zero consequences, which one would it be?",
  },
  {
    question:
      "Is there a physical space on campus where you feel genuinely calm? When was the last time you went there?",
  },
  {
    question:
      "Think about your last 'win'—no matter how small. Did you take a second to actually feel good about it?",
  },
  {
    question:
      "On a scale of 1-10, how much of 'You' is currently buried under 'Student You'?",
  },
  {
    question:
      "If you were your own hype-person today, what is the one thing you'd cheer yourself on for?",
  },
  {
    question:
      "What is a 'small joy' you've experienced today—a good coffee, a funny meme, or a short walk?",
  },
  {
    question:
      "Are you breathing deeply right now, or is your breath stuck in your chest?",
  },
  {
    question:
      "If you had an extra hour today that couldn't be used for studying, how would you spend it?",
  },
  {
    question:
      "Which 'version' of you are you bringing to your lectures today: the curious one, the tired one, or the 'just-get-it-done' one?",
  },
  {
    question:
      "What’s one thing about your living space (dorm or apartment) that you could tidy in 2 minutes to feel better?",
  },
  {
    question:
      "Is there a person on campus who always makes you feel a little lighter after talking to them?",
  },
  {
    question:
      "What is one piece of 'academic pressure' you can give yourself permission to let go of for the next hour?",
  },
  {
    question:
      "When you look in the mirror today, can you find one thing you appreciate about yourself that has nothing to do with school?",
  },
  {
    question:
      "How does your body feel after that last caffeine hit—energized, or just anxious?",
  },
  {
    question:
      "If you were writing a letter to yourself at the start of the semester, what's one piece of advice you'd give?",
  },
  {
    question:
      "Are you holding your phone too tightly? Try loosening your grip and stretching your fingers for a moment.",
  },
  {
    question:
      "What is a song that perfectly matches your current mood, and have you listened to it today?",
  },
  {
    question:
      "What’s a 'guilty pleasure' that you should stop feeling guilty about because it helps you recharge?",
  },
  {
    question:
      "If you could tell a professor one thing about your life outside their class, what would it be?",
  },
  {
    question:
      "What is one boundary you've set for yourself this week to protect your peace?",
  },
  {
    question:
      "Think about your favorite way to 'unplug.' When is the next time you can realistically do that?",
  },
  {
    question:
      "Is your current workspace helping you focus, or is it adding to your mental clutter?",
  },
  {
    question:
      "What is the most 'human' thing you’ve done today that had nothing to do with being a student?",
  },
  {
    question:
      "If you could outsource one 'adulting' task today (like laundry or dishes), which would it be?",
  },
  {
    question:
      "What part of your routine currently feels like it's on autopilot? Does it need a change?",
  },
  {
    question:
      "Think of one thing you're looking forward to after this current deadline or exam is over.",
  },
  {
    question:
      "How much of your stress right now is coming from your own expectations versus others' expectations?",
  },
  {
    question:
      "What is a compliment you’ve received recently that you found hard to believe, but was actually true?",
  },
  {
    question:
      "If your energy was a phone battery, what percentage would you be at right now?",
  },
  {
    question: "What is one thing you’ve forgiven yourself for this week?",
  },
  {
    question:
      "Are you staying hydrated, or has your water bottle been empty since your first lecture?",
  },
  {
    question:
      "What is one habit you have that makes you feel like 'the best version of yourself'?",
  },
  {
    question:
      "If you could change the 'vibe' of your day right now with one action, what would it be?",
  },
  {
    question:
      "What is a topic you could talk about for 30 minutes that has absolutely nothing to do with your major?",
  },
  {
    question:
      "How does the air feel on your skin right now? Cold, warm, or just right?",
  },
  {
    question:
      "What is a 'future goal' that feels exciting to you, rather than just intimidating?",
  },
  {
    question:
      "Is there a task you're avoiding because it feels too big? What’s the smallest possible first step?",
  },
  {
    question:
      "Who is someone you haven't texted in a while that would be happy to hear from you?",
  },
  {
    question:
      "What is one thing you are doing 'well enough' right now, even if it isn't perfect?",
  },
  {
    question: "If today was a chapter in a book, what would the title be?",
  },
];