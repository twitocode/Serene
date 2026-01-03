"use client";

import { completeStep4 } from "@/lib/client/onboarding-client";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { colleges, schools, universities } from "@/lib/data";
import { useOnboardingStore } from "@/lib/hooks/stores/onboarding-store";
import { StepFourSchema, stepFourSchema } from "@/lib/validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function StepFour() {
  const { school, setSchool, completeServerStep, goBack } =
    useOnboardingStore();
  const [activeTab, setActiveTab] = useState("universities");
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: completeStep4,
  });

  const defaultValues: StepFourSchema = {
    name: school,
    countryCode: "CA",
    regionCode: "",
    city: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: stepFourSchema,
    },
    onSubmit: async ({ value }) => {
      const schoolObj = schools.find((s) => s.name === value.name);
      if (!schoolObj) return;
      setSchool(value.name);

      const result = await mutation.mutateAsync(schoolObj);
      if (result.isSuccess) {
        completeServerStep();
        return;
      }

      if (result.errorCode === "VALIDATION_ERROR") {
        Object.keys(result.errors!).forEach((key) => {
          const fieldName = key.toLowerCase() as
            | "name"
            | "countryCode"
            | "regionCode"
            | "city";
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
        <h2 className="text-2xl font-semibold">What school do you attend?</h2>
        <p className="text-gray-500 text-sm">
          Select your university or college
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
          <form.Field name="name">
            {(field) => (
              <FormField field={field}>
                <FormItem>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="universities">
                        Universities
                      </TabsTrigger>
                      <TabsTrigger value="colleges">Colleges</TabsTrigger>
                    </TabsList>

                    <TabsContent value="universities" className="space-y-4">
                      <FormControl>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          onOpenChange={(open) => {
                            if (!open) field.handleBlur();
                          }}
                        >
                          <SelectTrigger className="bg-gray-100 border-0 w-full">
                            <SelectValue placeholder="Select School" />
                          </SelectTrigger>
                          <SelectContent>
                            {universities.map(({ name }) => (
                              <SelectItem key={name} value={name!}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </TabsContent>

                    <TabsContent value="colleges" className="space-y-4">
                      <FormControl>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                          onOpenChange={(open) => {
                            if (!open) field.handleBlur();
                          }}
                        >
                          <SelectTrigger className="bg-gray-100 border-0 w-full">
                            <SelectValue placeholder="Select College" />
                          </SelectTrigger>
                          <SelectContent>
                            {colleges.map(({ name }) => (
                              <SelectItem key={name} value={name!}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </TabsContent>
                  </Tabs>
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
