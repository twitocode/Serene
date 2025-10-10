import { constants } from "@/lib/constants";

export default function DailyAffirmations({ colour=  "text-primary" }) {
  const affirmations = constants.dailyAffirmations;
  const randomIndex = Math.floor(Math.random() * affirmations.length);

  const affirmation = affirmations[randomIndex];

  return (
    <div className="h-15 w-full flex items-center justify-center shadow-background">
      <p className={`${colour} text-xl`}>{affirmation}</p>
    </div>
  );
}
