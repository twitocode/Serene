import { DiceButton } from "@/lib/components/checkin/dice-button";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { ButtonGroup } from "@/lib/components/ui/button-group";
import { Textarea } from "@/lib/components/ui/textarea";
import { FormEventHandler, useState } from "react";

export default function PromptStep() {
  const { goBack, goNext, promptQuestion, randomizePrompt } = useCheckinStore(
    (s) => s
  );
  const [answer, setAnswer] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center p-4 gap-10 w-full md:w-1/2"
    >
      <h1 className="font-serif text-2xl md:text-4xl text-center">
        {promptQuestion}
      </h1>
      <DiceButton onRoll={randomizePrompt} />
      <Textarea
        placeholder="Type in your response here"
        id="response"
        className="h-10 resize-none"
        rows={40}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <ButtonGroup className="gap-1">
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
