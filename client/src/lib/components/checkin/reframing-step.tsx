import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Textarea } from "@/lib/components/ui/textarea";
import { motion } from "motion/react";
import { FormEventHandler } from "react";

export default function ReframingStep() {
  const { goBack, goNext, reframedThought, setReframedThought, lingeringThoughts } =
    useCheckinStore((s) => s);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center p-4 gap-10 w-full md:w-1/2"
    >
      <div className="space-y-4 text-center">
        <h1 className="font-serif text-2xl md:text-4xl text-center">
          Let's reframe that.
        </h1>
        {lingeringThoughts && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/30 p-4 rounded-lg italic text-muted-foreground mx-auto max-w-lg"
          >
            "{lingeringThoughts}"
          </motion.div>
        )}
        <p className="text-muted-foreground">
          Is there a kinder or more balanced way to look at this situation?
          What would you tell a good friend?
        </p>
      </div>

      <Textarea
        placeholder="Type your reframed thought here..."
        id="reframed-response"
        className="h-32 resize-none"
        value={reframedThought || ""}
        onChange={(e) => setReframedThought(e.target.value)}
      />

      <ButtonGroup className="gap-1 w-full grid grid-cols-2">
        <Button
          onClick={goBack}
          type="button"
          size="lg"
          className="px-10 text-lg"
        >
          Back
        </Button>
        <Button type="submit" size="lg" className="px-10 text-lg">
          Next
        </Button>
      </ButtonGroup>
    </form>
  );
}
