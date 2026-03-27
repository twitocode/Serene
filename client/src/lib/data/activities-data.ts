import { Activity, ActivityCategory } from "@/lib/types";

export const WELLNESS_ACTIVITIES: Activity[] = [
  {
    id: "mindful-1",
    title: "5-Minute Breathing Exercise",
    description: "Take a mindful pause with box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4.",
    category: ActivityCategory.Mindfulness,
    duration: "5 min",
    icon: "wind",
  },
  {
    id: "mindful-2",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today, no matter how small.",
    category: ActivityCategory.Mindfulness,
    duration: "10 min",
    icon: "sparkles",
  },
  {
    id: "mindful-3",
    title: "Body Scan Meditation",
    description: "Lie down and mentally scan your body from head to toe, releasing tension as you go.",
    category: ActivityCategory.Mindfulness,
    duration: "15 min",
    icon: "person-standing",
  },
  {
    id: "mindful-4",
    title: "Mindful Tea Ritual",
    description: "Brew your favorite tea and savor each sip, focusing on the warmth, aroma, and taste.",
    category: ActivityCategory.Mindfulness,
    duration: "10 min",
    icon: "coffee",
  },

  // Movement
  {
    id: "movement-1",
    title: "Gentle Stretching",
    description: "Do a full-body stretch routine to release tension and improve flexibility.",
    category: ActivityCategory.Movement,
    duration: "10 min",
    icon: "stretch-horizontal",
  },
  {
    id: "movement-2",
    title: "Nature Walk",
    description: "Take a walk outside and notice the sights, sounds, and smells around you.",
    category: ActivityCategory.Movement,
    duration: "20 min",
    icon: "tree-pine",
  },
  {
    id: "movement-3",
    title: "Dance Break",
    description: "Put on your favorite song and dance like nobody's watching!",
    category: ActivityCategory.Movement,
    duration: "5 min",
    icon: "music",
  },
  {
    id: "movement-4",
    title: "Yoga Flow",
    description: "Follow a gentle yoga sequence to connect mind and body.",
    category: ActivityCategory.Movement,
    duration: "20 min",
    icon: "heart-pulse",
  },

  // Creative
  {
    id: "creative-1",
    title: "Free Drawing",
    description:
      "Grab some paper and draw whatever comes to mind: no judgment, just expression.",
    category: ActivityCategory.Creative,
    duration: "15 min",
    icon: "palette",
  },
  {
    id: "creative-2",
    title: "Write a Poem",
    description: "Express your feelings through poetry. It doesn't have to rhyme!",
    category: ActivityCategory.Creative,
    duration: "15 min",
    icon: "pen-line",
  },
  {
    id: "creative-3",
    title: "Collage Making",
    description: "Cut out images from magazines or print them online to create a vision board.",
    category: ActivityCategory.Creative,
    duration: "30 min",
    icon: "scissors",
  },
  {
    id: "creative-4",
    title: "Photography Walk",
    description: "Take your phone or camera and capture beautiful moments around you.",
    category: ActivityCategory.Creative,
    duration: "20 min",
    icon: "camera",
  },

  // Social
  {
    id: "social-1",
    title: "Call a Friend",
    description: "Reach out to someone you haven't talked to in a while and catch up.",
    category: ActivityCategory.Social,
    duration: "15 min",
    icon: "phone",
  },
  {
    id: "social-2",
    title: "Share Your Feelings",
    description: "Open up to someone you trust about how you've been feeling lately.",
    category: ActivityCategory.Social,
    duration: "20 min",
    icon: "message-circle",
  },
  {
    id: "social-3",
    title: "Join a Group Activity",
    description: "Participate in a local club, class, or online community that interests you.",
    category: ActivityCategory.Social,
    duration: "60 min",
    icon: "users",
  },
  {
    id: "social-4",
    title: "Write a Letter",
    description:
      "Write a heartfelt letter to someone special. You can send it or keep it for yourself.",
    category: ActivityCategory.Social,
    duration: "20 min",
    icon: "mail",
  },

  // Self-Care
  {
    id: "selfcare-1",
    title: "Take a Relaxing Bath",
    description: "Draw a warm bath, add some salts or bubbles, and let yourself unwind.",
    category: ActivityCategory.SelfCare,
    duration: "30 min",
    icon: "bath",
  },
  {
    id: "selfcare-2",
    title: "Skincare Routine",
    description:
      "Pamper yourself with a full skincare routine: cleanse, mask, moisturize.",
    category: ActivityCategory.SelfCare,
    duration: "20 min",
    icon: "droplet",
  },
  {
    id: "selfcare-3",
    title: "Digital Detox Hour",
    description: "Put away all screens for an hour and do something analog.",
    category: ActivityCategory.SelfCare,
    duration: "60 min",
    icon: "smartphone-off",
  },
  {
    id: "selfcare-4",
    title: "Cozy Reading Time",
    description: "Curl up with a good book or magazine and escape into another world.",
    category: ActivityCategory.SelfCare,
    duration: "30 min",
    icon: "book-open",
  },

  // Learning
  {
    id: "learning-1",
    title: "Learn a New Word",
    description: "Look up a word you don't know and try to use it in a sentence today.",
    category: ActivityCategory.Learning,
    duration: "5 min",
    icon: "book",
  },
  {
    id: "learning-2",
    title: "Watch a TED Talk",
    description: "Choose an inspiring TED talk on a topic that interests you.",
    category: ActivityCategory.Learning,
    duration: "20 min",
    icon: "video",
  },
  {
    id: "learning-3",
    title: "Practice a New Skill",
    description:
      "Spend time learning something new, like an instrument, language, or craft.",
    category: ActivityCategory.Learning,
    duration: "30 min",
    icon: "target",
  },
  {
    id: "learning-4",
    title: "Listen to a Podcast",
    description: "Find a podcast episode about mental health, wellness, or personal growth.",
    category: ActivityCategory.Learning,
    duration: "30 min",
    icon: "headphones",
  },
];

export function getRandomActivities(count: number = 4): Activity[] {
  const shuffled = [...WELLNESS_ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getActivitiesByCategory(category: ActivityCategory): Activity[] {
  return WELLNESS_ACTIVITIES.filter((activity) => activity.category === category);
}
