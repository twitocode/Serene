import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { getMoodTypeColour, MOODS, MoodType } from "@/lib/data/moods";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Props {
  Icon: React.ComponentType<{ color?: string; strokeWidth: number }>;
  type: MoodType;
  scrollToBottom: () => void;
}
export default function MoodPicker({
  type,
  Icon,
  scrollToBottom,
}: Props) {
  const { selectedMood, setSelectedMood } = useCheckinStore((s) => s);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon color={getMoodTypeColour(type)} strokeWidth={2.5} />
        {type[0].toUpperCase() + type.substring(1, type.length)}
      </span>
      <div className="flex flex-wrap gap-2">
        {MOODS.filter((x) => x.type === type).map((x) => (
          <button
            key={x.label}
            type="button"
            className={cn(
              "rounded-xl border border-border/80 bg-muted/40 px-3 py-2.5 text-center text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent/50",
              selectedMood === x &&
                "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/25",
            )}
            onClick={() => {
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
