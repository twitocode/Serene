import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Textarea } from "@/lib/components/ui/textarea";
import { motion } from "motion/react";
import { FormEventHandler } from "react";

export default function ReframingStep() {
  const {
    goBack,
    goNext,
    reframedThought,
    setReframedThought,
    lingeringThoughts,
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
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Step 5 of 6
        </p>
        <h1 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
          A kinder angle
        </h1>
        {lingeringThoughts ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-left text-sm italic leading-relaxed text-muted-foreground"
          >
            &ldquo;{lingeringThoughts}&rdquo;
          </motion.div>
        ) : null}
        <p className="text-sm text-muted-foreground">
          Is there a gentler or more balanced way to see this? What would you tell a
          good friend?
        </p>
      </div>

      <Textarea
        placeholder="Write a reframed thought here…"
        id="reframed-response"
        className="min-h-[160px] resize-y rounded-xl border-border/80 bg-card text-base leading-relaxed"
        rows={6}
        value={reframedThought || ""}
        onChange={(e) => setReframedThought(e.target.value)}
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
