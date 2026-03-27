import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { getMoodTypeColour, getSeverityColor } from "@/lib/data/moods";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { useCompleteCheckinMutation } from "@/lib/hooks/queries/use-checkins";
import {
  Activity,
  Brain,
  CloudLightning,
  Heart,
  MessageCircle,
  Shield,
} from "lucide-react";

export default function CheckinCompleteStep() {
  const {
    somaticState,
    selectedMood,
    lingeringThoughts,
    reframedThought,
    promptAnswer,
    promptQuestion,
    goBack,
    complete: resetStore,
  } = useCheckinStore((s) => s);
  const today = getCurrentDate();

  const completeCheckinMutation = useCompleteCheckinMutation(today);

  const complete = async () => {
    try {
      if (!selectedMood) return;
      await completeCheckinMutation.mutateAsync({
        lingeringThoughts,
        reframedThought,
        moodLabel: selectedMood.label,
        moodSeverity: selectedMood.severity,
        promptAnswer,
        promptQuestion,
        somaticState,
      });
      resetStore();
    } catch (err) {
      console.error(err);
    }
  };

  const MoodIcon = selectedMood
    ? {
        vibe: Heart,
        energy: CloudLightning,
        mental: Brain,
        status: Shield,
      }[selectedMood.type]
    : null;

  const severityClass = selectedMood
    ? getSeverityColor(selectedMood.severity)
    : "";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-10">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Step 6 of 6
        </p>
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Review & save
        </h1>
        <p className="text-sm text-muted-foreground">
          Take a moment to read what you shared. Then finish when you&apos;re ready.
        </p>
      </div>

      <Card className="border-border/80 bg-card/95 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="font-serif text-lg">Mood</CardTitle>
            <CardDescription>Your chosen label</CardDescription>
          </div>
          {MoodIcon ? (
            <MoodIcon
              className="size-7 shrink-0"
              strokeWidth={2.25}
              color={getMoodTypeColour(selectedMood!.type)}
            />
          ) : null}
        </CardHeader>
        <CardContent>
          <Badge
            variant="outline"
            className={`text-sm font-medium ${severityClass}`}
          >
            {selectedMood?.label}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <MessageCircle className="size-5 text-primary" />
            Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium italic text-muted-foreground">
              &ldquo;{promptQuestion}&rdquo;
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">
              {promptAnswer || (
                <span className="italic text-muted-foreground">
                  No response provided.
                </span>
              )}
            </p>
          </div>
          {lingeringThoughts ? (
            <>
              <Separator className="bg-border/60" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lingering thoughts
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed md:text-base">
                  {lingeringThoughts}
                </p>
              </div>
            </>
          ) : null}
          {reframedThought ? (
            <>
              <Separator className="bg-border/60" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reframe
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary md:text-base">
                  {reframedThought}
                </p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card/95 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <Activity className="size-5 text-primary" />
            Body check-in
          </CardTitle>
          <CardDescription>
            From your somatic step — shown here for your review only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(somaticState).length > 0 ? (
            <div className="flex flex-col gap-3">
              {Object.entries(somaticState).map(([part, data]) => (
                <div key={part} className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium capitalize text-foreground">
                    {part}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.sensations.map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No body sensations recorded this time.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="h-12 flex-1 rounded-xl"
          onClick={goBack}
          type="button"
        >
          Back
        </Button>
        <Button
          size="lg"
          className="h-12 flex-1 rounded-xl"
          onClick={complete}
          disabled={completeCheckinMutation.isPending}
          type="button"
        >
          {completeCheckinMutation.isPending ? "Saving…" : "Finish check-in"}
        </Button>
      </div>
    </div>
  );
}
