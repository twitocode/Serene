"use client";

import { OnboardingStepProps } from "@/lib/components/onboarding/props";
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
import { colleges, universities } from "@serene/shared";
import { stepFourSchema } from "@serene/shared/validation";
import { useForm } from "@tanstack/react-form";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function StepFour({
  school,
  setSchool,
  onNext,
  onBack,
}: Pick<OnboardingStepProps, "school" | "setSchool" | "onNext" | "onBack">) {
  const [activeTab, setActiveTab] = useState("universities");

  const form = useForm({
    defaultValues: {
      school: school || "",
    },
    onSubmit: async ({ value }) => {
      setSchool(value.school);
      try {
        await onNext();
      } catch (error) {
        // Error is handled by global toast
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
          <form.Field
            name="school"
            validators={{
              onChange: ({ value }) => {
                const result = stepFourSchema.shape.name.safeParse(value);
                if (!result.success) {
                  return (
                    result.error.issues[0]?.message || "Invalid school name"
                  );
                }
                return undefined;
              },
            }}
          >
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
                              <SelectItem key={name} value={name}>
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
                              <SelectItem key={name} value={name}>
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
