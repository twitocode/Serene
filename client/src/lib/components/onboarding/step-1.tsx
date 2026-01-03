"use client";

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
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { stepOneSchema } from "@/lib/validation";
import { useForm, useStore } from "@tanstack/react-form";

export function StepOne() {
  const { name, setName, submitStep } = useOnboardingStore();

  const form = useForm({
    defaultValues: {
      name: name || "",
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        setName(value.name);

        try {
          await submitStep();
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

          if (
            error instanceof ApiError &&
            error.data?.code === "ArgumentException"
          ) {
            return { fields: { name: "This name is already taken" } };
          }
        }
      },
    },
    onSubmit: async () => {},
  });

  const formErrorMap = useStore(form.store, (formState) => formState.errorMap);

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
          {formErrorMap.onChange ? (
            <div>
              <em>There was an error on the form: {formErrorMap.onChange}</em>
            </div>
          ) : null}

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
