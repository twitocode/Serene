"use client";

import { completeStep6 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { stepSixSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STRUGGLES = [
  "Anxiety",
  "Depression",
  "Stress",
  "Loneliness",
  "Body Image",
  "Eating Disorder",
  "Grief",
  "Trauma",
  "Relationships",
  "Identity",
  "Suicidal Thoughts",
  "Other"
];

export function StepSix() {
  const {
    struggles,
    setStruggles,
    goBack,
    hasStarted,
  } = useOnboardingStore((state) => state);
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: (values: { struggles: string[] }) =>
      completeStep6(values.struggles),
  });

  const form = useForm({
    defaultValues: {
      struggles: hasStarted && struggles.length > 0 ? struggles : [],
    },
    validators: {
      onSubmit: stepSixSchema,
    },
    onSubmit: async ({ value }) => {
      setStruggles(value.struggles);

      const result = await mutation.mutateAsync({
        struggles: value.struggles,
      });
      if (result.isSuccess) {
        window.location.href = "/home";
        return;
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        setServerError("Please select at least one item.");
      } else {
        setServerError(
          result.message ?? "Something weird happened on the server"
        );
      }
    },
  });

  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">What brings you here?</h2>
        <p className="text-gray-500 text-sm">
          Select all that apply. This helps us personalize your experience.
        </p>
      </div>

      <Form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-4">
            <form.Field name="struggles">
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormControl>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {STRUGGLES.map((struggle) => {
                                const isSelected = field.state.value.includes(struggle);
                                return (
                                    <button
                                        key={struggle}
                                        type="button"
                                        onClick={() => {
                                            const newValue = isSelected
                                                ? field.state.value.filter((s) => s !== struggle)
                                                : [...field.state.value, struggle];
                                            field.handleChange(newValue);
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-full border transition-colors text-sm",
                                            isSelected
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black border-gray-300 hover:border-gray-400"
                                        )}
                                    >
                                        {struggle}
                                    </button>
                                );
                            })}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            <FormError error={serverError} />

            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
                type="button"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="bg-black hover:bg-gray-800 flex-1"
                    disabled={!canSubmit || isSubmitting || mutation.isPending}
                  >
                    {mutation.isPending ? "Finalizing..." : "Complete"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
