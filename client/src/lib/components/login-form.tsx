"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

import { auth } from "@/lib/auth";
import FormError from "@/lib/components/common/forms/form-error";
import { Button } from "@/lib/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from "@/lib/components/ui/tanstack-form";
import { Input } from "@/lib/components/ui/input";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

interface Props {
  serverUrl: string;
}

export function LoginForm({
  className,
  serverUrl,
  ...props
}: React.ComponentProps<"div"> & Props) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const checkEmailMutation = useMutation({
    mutationFn: auth.checkEmail,
    onSuccess: (result) => {
      if (result.isSuccess && result.data) {
        if (result.data.exists) {
          setEmail(form.getFieldValue("email"));
          setStep(2);
          setLoginError("");
        } else {
          setLoginError(
            "No accounts associated with this email, maybe try signing up?"
          );
        }
      } else {
        setLoginError(result.message || "Failed to verify email.");
      }
    },
  });

  const signInMutation = useMutation({
    mutationFn: auth.signIn,
    onSuccess: async (result) => {
      if (result.isSuccess) {
        try {
          const onboarding = await checkOnboarding();
          if (onboarding.completed) {
            window.location.href = "/home";
          } else {
            window.location.href = "/onboarding";
          }
        } catch (e) {
          window.location.href = "/home";
        }
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: authSchema,
    },
    onSubmit: async ({ value }) => {
      setLoginError("");
      await signInMutation.mutateAsync({
        email: email,
        password: value.password,
      });
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = form.getFieldValue("email");
    const emailValidation = emailSchema.safeParse({ email: emailValue });

    if (emailValidation.success) {
      setLoginError("");
      checkEmailMutation.mutate(emailValue);
    } else {
      // Manually set error for step 1
      form.setFieldMeta("email", (prev) => ({
        ...prev,
        errorMap: {
          onSubmit: [emailValidation.error.issues[0].message],
        },
      }));
    }
  };

  const handleBack = () => {
    setStep(1);
    setLoginError("");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
        </div>
        <h1 className="text-xl font-bold">
          {step === 1 ? "Welcome Back" : "Enter Password"}
        </h1>
        <FormDescription>
          {step === 1 ? (
            <>
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </>
          ) : (
            <>
              Welcome back, <span className="font-medium">{email}</span>
            </>
          )}
        </FormDescription>
      </div>

      <Form>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <form.Field name="email">
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (field.state.meta.errorMap.onSubmit) {
                            field.setMeta((prev) => ({
                              ...prev,
                              errorMap: { ...prev.errorMap, onSubmit: undefined },
                            }));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              )}
            </form.Field>
            <FormError error={loginError} />

            <Button
              type="submit"
              className="w-full"
              disabled={checkEmailMutation.isPending}
            >
              {checkEmailMutation.isPending ? "Checking..." : "Continue"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="password">
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (field.state.meta.errorMap.onSubmit) {
                            field.setMeta((prev) => ({
                              ...prev,
                              errorMap: { ...prev.errorMap, onSubmit: undefined },
                            }));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            <FormError error={loginError} />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>

              <Button
                type="submit"
                className="flex-1"
                disabled={signInMutation.isPending}
              >
                {signInMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        )}
      </Form>

      <FormDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FormDescription>
    </div>
  );
}

