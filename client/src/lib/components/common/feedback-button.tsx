import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { FieldGroup } from "@/lib/components/ui/field";
import { Toaster } from "@/lib/components/ui/sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { Textarea } from "@/lib/components/ui/textarea";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { FeedbackRequest } from "@/lib/types/api-types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const feedbackSchema = z.object({
  message: z.string().max(1000, "Message must be less than 1000 characters"),
});

export default function FeedbackButton() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const sendFeedbackMutation = useMutation({
    mutationFn: (input: FeedbackRequest) => {
      return apiFetch<FeedbackRequest>("/feedback", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSettled: () => {
      toast("Feedback sent. Thank you!");
      setShowSpinner(false);
      setHasSent(true);
    },
  });

  const form = useForm({
    defaultValues: {
      message: "",
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    onSubmit: async ({ value }) => {
      setShowSpinner(true);

      if (value.message === "") {
        toast("Feedback sent. Thank you!");
        setHasSent(true);
        return;
      }
      await sendFeedbackMutation.mutateAsync({
        message: value.message,
      });
    },
  });

  return (
    <div className="">
      <Toaster />
      <Dialog open={!hasSent && hasClicked} defaultOpen={false}>
        <DialogTrigger
          asChild
          onClick={() => {
            setHasSent(false);
            setHasClicked(true);
          }}
        >
          <Button variant="outline">Give Feedback</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="mb-4">
              Provide some feedback for the website
            </DialogTitle>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="message">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <FormField field={field}>
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type in your response here"
                              id="response"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                    );
                  }}
                </form.Field>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setHasClicked(false)}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={sendFeedbackMutation.isPending}
                  >
                    {sendFeedbackMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
