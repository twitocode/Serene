import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";

export default function PromptStep() {
  const { goBack, goNext } = useCheckinStore((s) => s);
  
  return (
    <div>
      Prompt
      <Button onClick={goBack}>Back</Button>
    </div>
  );
}
