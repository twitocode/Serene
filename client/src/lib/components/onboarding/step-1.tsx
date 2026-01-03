"use client";

import { completeStep1 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { stepOneSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function StepOne() {
  const { name, setName, completeServerStep } = useOnboardingStore();
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: completeStep1,
  });

  const form = useForm({
    defaultValues: {
      name: name || "",
    },
    validators: {
      onChange: stepOneSchema,
    },
    onSubmit: async ({ value }) => {
      setName(value.name);
      const result = await mutation.mutateAsync(value.name);

      if (result.isSuccess) {
        completeServerStep();
        return;
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        Object.keys(result.errors!).forEach((key) => {
          const fieldName = key.toLowerCase() as "name";
          form.setFieldMeta(fieldName, (prev) => ({
            ...prev,
            errorMap: {
              onChange: [result.errors![key]],
            },
          }));
        });
      } else if (result.errorCode === "USERNAME_TAKEN") {
        form.setFieldMeta("name", (prev) => ({
          ...prev,
          errorMap: {
            onChange: [result.message],
          },
        }));
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
        <h2 className="text-2xl font-semibold">What should we call you?</h2>
        <p className="text-gray-500 text-sm">This is your username</p>
      </div>

      <Form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-gray-100 border-0"
                      autoFocus
                      autoComplete="username"
                      onBlur={field.handleBlur}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              </FormField>
            )}
          </form.Field>
          <FormError error={serverError} />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 w-full"
                disabled={!canSubmit || isSubmitting || mutation.isPending}
              >
                {mutation.isPending ? "Validating..." : "Continue"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Form>
    </div>
  );
}
