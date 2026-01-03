"use client";

import { completeStep3 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { countries } from "@/lib/data";
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { StepThreeSchema, stepThreeSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function StepThree() {
  const {
    countryCode: country,
    setCountryCode: setCountry,
    completeServerStep,
    goBack,
  } = useOnboardingStore();
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: completeStep3,
  });

  const defaultValues: StepThreeSchema = {
    countryCode: country || "",
  };
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: stepThreeSchema,
    },
    onSubmit: async ({ value }) => {
      setCountry(value.countryCode);
      const result = await mutation.mutateAsync(value.countryCode);

      if (result.isSuccess) {
        completeServerStep();
        return;
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        Object.keys(result.errors!).forEach((key) => {
          const fieldName = key.toLowerCase() as "countryCode";
          form.setFieldMeta(fieldName, (prev) => ({
            ...prev,
            errorMap: {
              onChange: [result.errors![key]],
            },
          }));
        });
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
        <h2 className="text-2xl font-semibold">Where do you live?</h2>
        <p className="text-gray-500 text-sm">
          Select your country of residence
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
          <form.Field
            name="countryCode"
            validators={{
              onChange: ({ value }) => {
                const result =
                  stepThreeSchema.shape.countryCode.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0]?.message || "Invalid country";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onOpenChange={(open) => {
                        if (!open) field.handleBlur();
                      }}
                    >
                      <SelectTrigger className="bg-gray-100 border-0 w-full">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  {mutation.isPending ? "Validating..." : "Continue"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </Form>
    </div>
  );
}
