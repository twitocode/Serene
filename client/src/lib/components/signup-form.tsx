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
  FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { Input } from "@/lib/components/ui/input";
import { cn } from "@/lib/utils";
import { emailSchema, signupSchema } from "@/lib/validation";
import Link from "next/link";
import GoogleButton from "@/lib/components/auth/google-button";
import { Separator } from "@/lib/components/ui/separator";

interface Props {
  serverUrl: string;
}

export function SignupForm({
  className,
  serverUrl,
  ...props
}: React.ComponentProps<"div"> & Props) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [signupError, setSignupError] = useState("");

  const checkEmailMutation = useMutation({
    mutationFn: auth.checkEmail,
    onSuccess: (result) => {
      if (result.isSuccess && result.data) {
        if (!result.data.exists) {
          setEmail(form.getFieldValue("email"));
          setStep(2);
          setSignupError("");
        } else {
          setSignupError("Account already exists. Please log in instead.");
        }
      } else {
        setSignupError(result.message || "Failed to verify email.");
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: auth.signUp,
    onSuccess: (result) => {
      if (result.isSuccess) {
        window.location.href = "/onboarding";
      } else {
        setSignupError(result.message || "Signup failed. Please try again.");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setSignupError("");
      await signUpMutation.mutateAsync({
        email: email,
        password: value.password,
        name: email.split("@")[0],
      });
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = form.getFieldValue("email");
    const emailValidation = emailSchema.safeParse({ email: emailValue });

    if (emailValidation.success) {
      setSignupError("");
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
    setSignupError("");
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
          {step === 1 ? "Create Account" : "Set Password"}
        </h1>
        <FormDescription>
          {step === 1 ? (
            <>
              Already have an account? <Link href="/login">Login</Link>
            </>
          ) : (
            <>
              Create account for <span className="font-medium">{email}</span>
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
                              errorMap: {
                                ...prev.errorMap,
                                onSubmit: undefined,
                              },
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

            <FormError error={signupError} />

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
                              errorMap: {
                                ...prev.errorMap,
                                onSubmit: undefined,
                              },
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

            <form.Field name="confirmPassword">
              {(field) => (
                <FormField field={field}>
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (field.state.meta.errorMap.onSubmit) {
                            field.setMeta((prev) => ({
                              ...prev,
                              errorMap: {
                                ...prev.errorMap,
                                onSubmit: undefined,
                              },
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

            <FormError error={signupError} />

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
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending ? "Creating..." : "Sign Up"}
              </Button>
            </div>
          </form>
        )}
      </Form>
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or with
          </span>
        </div>
      </div>
      <GoogleButton serverUrl={serverUrl} />
      <FormDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FormDescription>
    </div>
  );
}
