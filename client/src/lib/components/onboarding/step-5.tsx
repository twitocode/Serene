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
import { useForm } from "@tanstack/react-form";
import { ChevronLeft } from "lucide-react";
import { stepFiveSchema } from "./validation-schemas";

const koalaColors = ["Gray", "Brown", "White", "Black", "Cream", "Tan"];

export function StepFive({
  koalaName,
  setKoalaName,
  koalaColor,
  setKoalaColor,
  koalaPronouns,
  setKoalaPronouns,
  onNext,
  onBack,
}: Pick<
  OnboardingStepProps,
  | "koalaName"
  | "setKoalaName"
  | "koalaColor"
  | "setKoalaColor"
  | "koalaPronouns"
  | "setKoalaPronouns"
  | "onNext"
  | "onBack"
>) {
  const form = useForm({
    defaultValues: {
      koalaName: koalaName || "",
      koalaColor: koalaColor || "",
      koalaPronouns: koalaPronouns || "",
    },
    onSubmit: async ({ value }) => {
      setKoalaName(value.koalaName);
      setKoalaColor(value.koalaColor);
      setKoalaPronouns(value.koalaPronouns);
      onNext();
    },
  });

  return (
    <div className="text-center space-y-6 max-w-md w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Meet your koala companion! 🐨
        </h2>
        <p className="text-gray-500 text-sm">
          Let&apos;s personalize your koala friend
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
            name="koalaName"
            validators={{
              onChange: ({ value }) => {
                const result = stepFiveSchema.shape.koalaName.safeParse(value);
                if (!result.success) {
                  return (
                    result.error.issues[0]?.message || "Invalid koala name"
                  );
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Koala's name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-gray-100 border-0"
                      onBlur={field.handleBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="koalaColor"
            validators={{
              onChange: ({ value }) => {
                const result = stepFiveSchema.shape.koalaColor.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0]?.message || "Invalid color";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormLabel>Colour</FormLabel>

                  <FormControl>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onOpenChange={(open) => {
                        if (!open) field.handleBlur();
                      }}
                    >
                      <SelectTrigger className="bg-gray-100 border-0">
                        <SelectValue placeholder="Select koala's color" />
                      </SelectTrigger>
                      <SelectContent>
                        {koalaColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
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

          <form.Field
            name="koalaPronouns"
            validators={{
              onChange: ({ value }) => {
                if (value) {
                  const result =
                    stepFiveSchema.shape.koalaPronouns.safeParse(value);
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
                  {isSubmitting ? "Validating..." : "Complete"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </Form>
    </div>
  );
}
