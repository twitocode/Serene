"use client";

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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/ui/sidebar";
import { Textarea } from "@/lib/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/ui/tooltip";
import { Toaster } from "@/lib/components/ui/sonner";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { FeedbackRequest } from "@/lib/types/api-types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const feedbackSchema = z.object({
  message: z.string().max(1000, "Message must be less than 1000 characters"),
});

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;

  const sendFeedbackMutation = useMutation({
    mutationFn: (input: FeedbackRequest) => {
      return apiFetch<FeedbackRequest>("/feedback", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    onSettled: () => {
      toast("Feedback sent. Thank you!");
      setOpen(false);
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
      if (value.message === "") {
        toast("Feedback sent. Thank you!");
        setOpen(false);
        return;
      }
      await sendFeedbackMutation.mutateAsync({
        message: value.message,
      });
    },
  });

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      size={collapsed ? "icon" : "default"}
      className={cn(
        "shrink-0",
        collapsed
          ? "size-8 rounded-lg"
          : "h-9 w-full justify-center px-3 text-sm font-medium",
      )}
      aria-label={collapsed ? "Give feedback" : undefined}
    >
      {collapsed ? (
        <MessageSquarePlus className="size-4" strokeWidth={2} />
      ) : (
        "Give feedback"
      )}
    </Button>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Toaster />
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) form.reset();
          }}
        >
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>{triggerButton}</DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                Give feedback
              </TooltipContent>
            </Tooltip>
          ) : (
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          )}

          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="mb-4">
                Provide some feedback for the website
              </DialogTitle>
            </DialogHeader>

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
                          <FormLabel>Your feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your feedback here"
                              id="feedback-response"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              className="min-h-[120px]"
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
                    <Button type="button" variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={sendFeedbackMutation.isPending}>
                    {sendFeedbackMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
