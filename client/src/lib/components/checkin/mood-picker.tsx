import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { MOODS, MoodType } from "@/lib/data/moods";
import { cn } from "@/lib/utils";
import { Heart, LucideProps } from "lucide-react";

interface Props {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  iconColour: string;
  type: MoodType;
  setHasSelected: (a: boolean) => void;
}
export default function MoodPicker({
  iconColour,
  type,
  setHasSelected,
}: Props) {
  const { goNext, selectedMood, setSelectedMood } = useCheckinStore((s) => s);

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2">
        <Heart color={iconColour} />{" "}
        {type[0].toUpperCase() + type.substring(1, type.length)}
      </span>
      <div className="flex-wrap flex gap-1 md:gap-2">
        {MOODS.filter((x) => x.type == type).map((x) => (
          <div
            key={x.label}
            className={cn(
              "border rounded-md bg-primary text-primary-foreground px-4 py-2 text-center max-w-35 text-sm md:md hover:scale-105 active:opacity-75",
              {"ring-2 ring-secondary": selectedMood === x}
            )}
            onClick={() => {
              setHasSelected(true);
              setSelectedMood(x);
            }}
          >
            {x.label}
          </div>
        ))}
      </div>
    </div>
  );
}
