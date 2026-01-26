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
    toggleIsCheckingIn,
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
    <div className="flex flex-col items-center p-4 gap-6 w-full max-w-2xl mx-auto overflow-y-auto max-h-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif">Check-in Summary</h1>
        <p className="text-muted-foreground">
          Review your responses before finishing.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl">Your Mood</CardTitle>
            <CardDescription>How you felt today</CardDescription>
          </div>
          {MoodIcon && (
            <MoodIcon
              className={`h-6 w-6 drop-shadow-lg`}
              strokeWidth={3}
              color={getMoodTypeColour(selectedMood!.type)}
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={`text-lg px-4 py-1 ${severityClass}`}
            >
              {selectedMood?.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Reflection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground italic">
              "{promptQuestion}"
            </p>
            <p className="text-md whitespace-pre-wrap">
              {promptAnswer || (
                <span className="text-muted-foreground italic">
                  No response provided.
                </span>
              )}
            </p>
          </div>
          {lingeringThoughts && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Lingering Thoughts
                </p>
                <p className="text-md whitespace-pre-wrap">
                  {lingeringThoughts}
                </p>
              </div>
            </>
          )}
          {reframedThought && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Reframed Perspective
                </p>
                <p className="text-md whitespace-pre-wrap text-emerald-600 dark:text-emerald-400">
                  {reframedThought}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Physical State
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(somaticState).length > 0 ? (
            <div className="flex flex-col gap-3">
              {Object.entries(somaticState).map(([part, data]) => (
                <div key={part} className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{part}</span>
                  <div className="flex flex-wrap gap-1">
                    {data.sensations.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No physical sensations noted.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 w-full pt-4 mb-8">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={goBack}
          type="button"
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={complete}
          disabled={completeCheckinMutation.isPending}
          type="button"
        >
          {completeCheckinMutation.isPending ? "Saving..." : "Finish Check-in"}
        </Button>
      </div>
    </div>
  );
}