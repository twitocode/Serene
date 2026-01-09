import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { getMoodTypeColour, MOODS, MoodType } from "@/lib/data/moods";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface Props {
  Icon: React.ComponentType<{ color?: string, strokeWidth: number }>;
  type: MoodType;
  scrollToBottom: () => void;
  setHasSelected: (a: boolean) => void;
}
export default function MoodPicker({
  type,
  Icon,
  setHasSelected,
  scrollToBottom,
}: Props) {
  const { goNext, selectedMood, setSelectedMood } = useCheckinStore((s) => s);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <Icon color={getMoodTypeColour(type)} strokeWidth={3}/>
        {type[0].toUpperCase() + type.substring(1, type.length)}
      </span>
      <div className="flex-wrap flex gap-1 md:gap-2">
        {MOODS.filter((x) => x.type === type).map((x) => (
          <button
            key={x.label}
            type="button"
            className={cn(
              "border rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-center max-w-35 text-sm md:md transition hover:scale-105 active:opacity-75",
              { "ring-2 ring-primary shadow-lg": selectedMood === x }
            )}
            onClick={() => {
              setHasSelected(true);
              setSelectedMood(x);
              isMobile && scrollToBottom();
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
    </div>
  );
}
