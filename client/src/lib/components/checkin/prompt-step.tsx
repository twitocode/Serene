import { DiceButton } from "@/lib/components/checkin/dice-button";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Textarea } from "@/lib/components/ui/textarea";
import { FormEventHandler } from "react";

export default function PromptStep() {
  const {
    goBack,
    goNext,
    promptQuestion,
    randomizePrompt,
    promptAnswer,
    setPromptAnswer,
  } = useCheckinStore((s) => s);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-xl flex-col gap-8 pb-8"
    >
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Step 2 of 6
        </p>
        <h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
          {promptQuestion}
        </h1>
        <p className="text-sm text-muted-foreground">
          Write freely — a few sentences or a list is enough.
        </p>
      </div>

      <div className="flex justify-center">
        <DiceButton onRoll={randomizePrompt} />
      </div>

      <Textarea
        placeholder="Type your response here..."
        id="response"
        className="min-h-[180px] resize-y rounded-xl border-border/80 bg-card text-base leading-relaxed"
        rows={8}
        value={promptAnswer || ""}
        onChange={(e) => setPromptAnswer(e.target.value)}
      />

      <ButtonGroup className="grid w-full grid-cols-2 gap-3">
        <Button
          onClick={goBack}
          type="button"
          size="lg"
          variant="outline"
          className="h-12 rounded-xl"
        >
          Back
        </Button>
        <Button type="submit" size="lg" className="h-12 rounded-xl">
          Next
        </Button>
      </ButtonGroup>
    </form>
  );
}
