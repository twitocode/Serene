"use client";

import { OnboardingStepProps } from "@/lib/components/onboarding/props";
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
import { ApiError } from "@/lib/helpers/api-fetch";
import { stepOneSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";

export function StepOne({
  name,
  setName,
  onNext,
}: Pick<OnboardingStepProps, "name" | "setName" | "onNext">) {
  const form = useForm({
    defaultValues: {
      name: name || "",
    },
    validators: {
      onSubmitAsync: async ({ formApi, value, signal }) => {
        setName(value.name);

        try {
          await onNext();
        } catch (error) {
          if (
            error instanceof ApiError &&
            error.status === 400 &&
            error.data?.errors
          ) {
            const errors = error.data.errors;
            Object.keys(errors).forEach((key) => {
              const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
              if (fieldName === "name") {
                form.setFieldMeta("name", (prev) => ({
                  ...prev,
                  errors: errors[key],
                }));
              }
            });
          }

          if (error instanceof ApiError && error.data?.code === "DB_ERROR") {
            console.log(error);
            form.setFieldMeta("name", (prev) => ({
              ...prev,
              errors: ["This name is already taken"],
            }));
          }
          return { name: "not a proper name idiot" };
        }
      },
    },
    onSubmit: async ({ value }) => {},
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
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = stepOneSchema.shape.name.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0]?.message || "Invalid name";
                }
                return undefined;
              },
            }}
          >
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Validating..." : "Continue"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Form>
    </div>
  );
}
