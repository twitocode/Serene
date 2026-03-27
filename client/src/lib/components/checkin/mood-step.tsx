import MoodPicker from "@/lib/components/checkin/mood-picker";
import { MochiDefault as Mochi } from "@/lib/components/common/mochi";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-bottom";
import { Brain, CloudLightning, Heart, Shield } from "lucide-react";
import { FormEventHandler } from "react";

export default function MoodStep() {
  const { goNext, selectedMood } = useCheckinStore((s) => s);
  const [scrollRef, scrollToBottom] = useScrollToBottom<HTMLFormElement>();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (selectedMood != null) {
      goNext();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-8 pb-8"
      ref={scrollRef}
    >
      <div className="card-organic border-border/80 bg-card/95 p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">
          <div className="flex shrink-0 justify-center md:w-44 md:justify-start">
            <Mochi className="size-36 md:size-40" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step 1 of 6
            </p>
            <h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
              How are you right now?
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose one label in each row that fits best — there&apos;s no wrong
              answer.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <MoodPicker
          scrollToBottom={scrollToBottom}
          type="vibe"
          Icon={Heart}
        />
        <MoodPicker
          scrollToBottom={scrollToBottom}
          type="energy"
          Icon={CloudLightning}
        />
        <MoodPicker
          scrollToBottom={scrollToBottom}
          type="mental"
          Icon={Brain}
        />
        <MoodPicker
          scrollToBottom={scrollToBottom}
          type="status"
          Icon={Shield}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-border/80 bg-background/90 px-4 py-4 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-none">
        <Button
          type="submit"
          size="lg"
          className="btn-playful w-full rounded-xl text-base md:max-w-xs"
          disabled={selectedMood === null}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
