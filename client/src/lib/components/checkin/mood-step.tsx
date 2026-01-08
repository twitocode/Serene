import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  FreeScrollCarousel,
} from "@/lib/components/ui/free-scroll-carousel";
import { Mood, MOODS } from "@/lib/data/moods";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { FormEventHandler, useState } from "react";

export default function MoodStep() {
  const { goNext } = useCheckinStore((s) => s);
  const isMobile = useIsMobile();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-between items-center p-4 gap-10"
    >
      <h1 className="font-serif text-5xl">How do you feel right now?</h1>
      <FreeScrollCarousel
        opts={{
          align: "start",
        }}
        className="flex-1 max-w-1/4"
      >
        <CarouselContent className="px-20">
          {[...MOODS]
            .sort((a, b) => {
              const emotionOrder = {
                Joy: 1,
                Calm: 2,
                Neutral: 3,
                Fatigue: 4,
                Sadness: 5,
                Fear: 6,
                Anger: 7,
              };

              const typeOrder = emotionOrder[a.type] - emotionOrder[b.type];
              if (typeOrder !== 0) return typeOrder;
              return a.intensity - b.intensity;
            })
            .map((mood) => (
              <CarouselItem
                key={mood.label}
                className="md:basis-1/3 lg:basis-1/4 basis-1/2"
              >
                <Card
                  className={cn(
                    "rounded-4xl border-none transition-all duration-300 shadow-xl my-8 mx-2",
                    mood.bgColour,

                    selectedMood === mood
                      ? "scale-110 hover:scale-110 active:scale-110 z-10 ring-2 ring-primary"
                      : "hover:scale-105 active:scale-95"
                  )}
                  onClick={() => {
                    setSelectedMood(mood);
                    setHasSelected(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle>
                      <span className="flex justify-between items-center">
                        <Badge
                          className={cn(
                            mood.typeColour,
                            "text-gray-800 shadow-md"
                          )}
                        >
                          {mood.type}
                        </Badge>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center p-6"></CardContent>
                  <CardFooter className="flex flex-col items-baseline justify-center">
                    <span className="text-3xl font-bold text-black">
                      {mood.label}
                    </span>
                    <span className="text-muted-foreground">
                      {isMobile ? "Tap to Select" : "Click to select"}
                    </span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </FreeScrollCarousel>
      <div className="min-h-[80px] w-full flex justify-center items-center">
        <AnimatePresence>
          {hasSelected && (
            <motion.div
              key="next-button"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.4 }}
            >
              <Button
                onClick={goNext}
                type="submit"
                size="lg"
                className="px-10 text-lg"
              >
                Next
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </form>
  );
}
