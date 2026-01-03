"use client";

import { OnboardingStepProps } from "@/lib/components/onboarding/props";
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
import { ApiError } from "@/lib/helpers/api-fetch";
import { stepTwoSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { ChevronLeft } from "lucide-react";

export function StepTwo({
  age,
  setAge,
  gender,
  setGender,
  pronouns,
  setPronouns,
  onNext,
  onBack,
}: Pick<
  OnboardingStepProps,
  | "age"
  | "setAge"
  | "gender"
  | "setGender"
  | "pronouns"
  | "setPronouns"
  | "onNext"
  | "onBack"
>) {
  const form = useForm({
    defaultValues: {
      age: age || 0,
      gender: gender || "",
      pronouns: pronouns || "",
    },
    onSubmit: async ({ value }) => {
      setAge(value.age);
      setGender(value.gender);
      setPronouns(value.pronouns);
      try {
        await onNext();
      } catch (error) {
        if (error instanceof ApiError && error.status === 400 && error.data?.errors) {
          const errors = error.data.errors;
          Object.keys(errors).forEach((key) => {
            const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
            if (fieldName === "age") {
              form.setFieldMeta("age", (prev) => ({
                ...prev,
                errors: errors[key],
              }));
            }
            if (fieldName === "gender") {
              form.setFieldMeta("gender", (prev) => ({
                ...prev,
                errors: errors[key],
              }));
            }

            if (fieldName === "pronouns") {
              form.setFieldMeta("pronouns", (prev) => ({
                ...prev,
                errors: errors[key],
              }));
            }
          });
        }
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
            validators={{
              onChange: ({ value }) => {
                const result = stepTwoSchema.shape.age.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0]?.message || "Invalid age";
                }
                return undefined;
              },
            }}
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
              validators={{
                onChange: ({ value }) => {
                  const result = stepTwoSchema.shape.gender.safeParse(value);
                  if (!result.success) {
                    return result.error.issues[0]?.message || "Invalid gender";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
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
              validators={{
                onChange: ({ value }) => {
                  if (value) {
                    const result =
                      stepTwoSchema.shape.pronouns.safeParse(value);
                    if (!result.success) {
                      return (
                        result.error.issues[0]?.message || "Invalid pronouns"
                      );
                    }
                  }
                  return undefined;
                },
              }}
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

          <div className="flex gap-4">
            <Button
              onClick={onBack}
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
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Validating..." : "Continue"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </Form>
    </div>
  );
}
