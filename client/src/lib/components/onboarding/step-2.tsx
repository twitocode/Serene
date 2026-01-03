"use client";

import { completeStep2 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
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
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { StepTwoSchema, stepTwoSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function StepTwo() {
  const {
    age,
    setAge,
    gender,
    setGender,
    pronouns,
    setPronouns,
    completeServerStep,
    goBack,
  } = useOnboardingStore();
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: (values: { age: number; gender: string; pronouns: string }) =>
      completeStep2(values.age, values.gender, values.pronouns),
  });

  const defaultValues: StepTwoSchema = {
    age: age ?? 0,
    gender: "Prefer not to say",
    pronouns: pronouns ?? ""
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: stepTwoSchema,
    },
    onSubmit: async ({ value }) => {
      setAge(value.age);
      setGender(value.gender);
      setPronouns(value.pronouns);

      const result = await mutation.mutateAsync({
        age: value.age,
        gender: value.gender,
        pronouns: value.pronouns.replace("-", " "),
      });

      if (result.isSuccess) {
        completeServerStep();
        return;
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        Object.keys(result.errors!).forEach((key) => {
          const fieldName = key.toLowerCase() as "age" | "gender" | "pronouns";
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
        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
        <p className="text-gray-500 text-sm">
          This helps us personalize your experience
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
            name="age"
          >
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Age"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      className="bg-gray-100 border-0"
                      type="number"
                      onBlur={field.handleBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            )}
          </form.Field>
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="gender"
            >
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value as any)}
                        onOpenChange={(open) => {
                          if (!open) field.handleBlur();
                        }}
                      >
                        <SelectTrigger className="bg-gray-100 border-0 w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-Binary">Non-binary</SelectItem>
                          <SelectItem value="Prefer-not-to-say">
                            Prefer-not-to-say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="pronouns"

            >
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Pronouns</FormLabel>

                    <FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        onOpenChange={(open) => {
                          if (!open) field.handleBlur();
                        }}
                      >
                        <SelectTrigger className="bg-gray-100 border-0  w-full">
                          <SelectValue placeholder="Select Pronouns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="He/Him">He/Him</SelectItem>
                          <SelectItem value="She/Her">She/Her</SelectItem>
                          <SelectItem value="They/Them">They/Them</SelectItem>
                          <SelectItem value="Prefer not to say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                </FormField>
              )}
            </form.Field>
          </div>
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
