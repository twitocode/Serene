"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/lib/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form";
import { Input } from "@/lib/components/ui/input";
import { constants } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  setupProfileSchema,
  SetupProfileSchema,
} from "@/lib/components/auth/formSchema";
import DatePicker from "@/lib/components/forms/DatePicker";
import FormSelect from "@/lib/components/forms/FormSelect";
import { GalleryVerticalEndIcon } from "lucide-react";
import { submitProfileSetupForm } from "@/lib/actions/submitProfileSetupForm";

export default function ProfileSetupForm({
  className = "",
}: {
  className?: string;
}) {
  const form = useForm<SetupProfileSchema>({
    resolver: zodResolver(setupProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      dateOfBirth: undefined,
      country: "",
      gender: "",
      pronouns: "",
      avatarUrl: "",
    },
  });

  async function onSubmit(data: z.infer<SetupProfileSchema>) {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("username", data.username);

    if (data.dateOfBirth) {
      formData.append("dateOfBirth", data.dateOfBirth.toISOString());
    }
     formData.append("country", data.country);
    formData.append("gender", data.gender);
    formData.append("pronouns", data.pronouns);
    formData.append("avatarUrl", data.avatarUrl ||
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg");

    const result = await submitProfileSetupForm(formData);

    if (!result?.success) {
      if (result?.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as any, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <a
              href="##"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">Serene</span>
            </a>
            <h1 className="text-xl font-bold">
              Finish Setting up your Profile
            </h1>
          </div>

          {/* Form Fields */}
          <div className="grid gap-1 md:grid-cols-2">
            {/* Left Side */}
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        {/* <Input type="hidden" {...field} /> */}
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Helps to determine age specific resources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <FormSelect
                          value={field.value}
                          onChange={field.onChange}
                          items={constants.countries}
                        />
                      </FormControl>
                      <FormDescription>
                        Helps to determine country specific resources
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <FormSelect
                          value={field.value}
                          onChange={field.onChange}
                          items={constants.genders}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pronouns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <FormSelect
                          value={field.value}
                          onChange={field.onChange}
                          items={constants.pronouns}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Side: Avatar */}
            <div>
              {form.watch("avatarUrl") && (
                <img
                  src={form.watch("avatarUrl")!}
                  alt="Avatar Preview"
                  className="rounded-md"
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              Complete!
              {form.formState.isSubmitting && <> Loading...</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
