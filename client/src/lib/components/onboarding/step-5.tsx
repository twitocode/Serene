"use client";

import { completeStep5 } from "@/lib/client/onboarding-client";
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
import { stepFiveSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { KoalaColorPicker } from "./koala-color-picker";

export function StepFive() {
  const {
    koalaName,
    setKoalaName,
    koalaColour,
    setKoalaColor,
    koalaPronouns,
    setKoalaPronouns,
    goBack,
  } = useOnboardingStore();
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: (values: { name: string; pronouns: string; color: string }) =>
      completeStep5(values.name, values.pronouns, values.color),
  });


  const form = useForm({
    defaultValues: {
      koalaColour: koalaColour || "#5EEAD4",
      koalaName: koalaName ?? "",
      koalaPronouns: koalaPronouns ?? ""
    },
    validators: {
      onSubmit: stepFiveSchema,
    },
    onSubmit: async ({ value }) => {
      setKoalaName(value.koalaName);
      setKoalaColor(value.koalaColour);
      setKoalaPronouns(value.koalaPronouns);

      const result = await mutation.mutateAsync({
        name: value.koalaName,
        pronouns: value.koalaPronouns || "They/Them",
        color: value.koalaColour,
      });
      if (result.isSuccess) {
        window.location.href = "/home";
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        Object.keys(result.errors!).forEach((key) => {
          const fieldName = key.toLowerCase() as
            | "koalaName"
            | "koalaColour"
            | "koalaPronouns";
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
        <h2 className="text-2xl font-semibold">
          Meet your koala companion!
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
          <form.Field name="koalaName">
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

          <form.Field name="koalaColour">
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <FormLabel>Colour</FormLabel>

                  <FormControl>
                    <KoalaColorPicker
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                      className="bg-gray-100 border-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            )}
          </form.Field>

          <form.Field name="koalaPronouns">
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
                  {mutation.isPending ? "Validating..." : "Complete"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </Form>
    </div>
  );
}
