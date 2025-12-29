"use client";

import { useForm } from "@tanstack/react-form";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

import { authClient } from "@/lib/auth";
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
import { cn } from "@/lib/utils";
import Link from "next/link";
import { z } from "zod";

const emailSchema = z.object({
  email: z.email(),
});

const authSchema = z.object({
  email: z.email(),
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

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: authSchema,
    },

    onSubmit: async ({ value }) => {
      setLoginError("");
      try {
        const result = await authClient.signIn.email({
          email: email,
          password: value.password,
        });

        if (result.error) {
          setLoginError(result.error.message || "Invalid email or password");
        } else {
          console.log("Login successful:", result.data);
          // Redirect to dashboard or home page
          window.location.href = "/dashboard";
        }
      } catch (error) {
        setLoginError("Login failed. Please try again.");
      }
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = form.getFieldValue("email");
    const emailValidation = emailSchema.safeParse({ email: emailValue });

    if (emailValidation.success) {
      const res = await fetch(
        `${serverUrl}/users/exists/${encodeURIComponent(emailValue)}`
      );
      const data = await res.json();

      //email exists
      console.log(data);

      if (data.exists) {
        setEmail(emailValue);
        setStep(2);
      }
    }
  };

  const handleBack = () => {
    setStep(1);
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
                <FormField name={field.name}>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FormControl>
                    {!field.state.meta.isValid && field.state.meta.isTouched
                      ? field.state.meta.errors.map((error) => (
                          <FormMessage
                            role="alert"
                            key={error?.message || "error"}
                          >
                            {error?.message}
                          </FormMessage>
                        ))
                      : null}
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            <Button type="submit" className="w-full">
              Continue
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
                <FormField name={field.name}>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FormControl>
                    {!field.state.meta.isValid && field.state.meta.isTouched
                      ? field.state.meta.errors.map((error) => (
                          <FormMessage
                            role="alert"
                            key={error?.message || "error"}
                          >
                            {error?.message}
                          </FormMessage>
                        ))
                      : null}
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            {loginError && (
              <div className="text-sm text-red-600 text-center">
                {loginError}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                )}
              </form.Subscribe>
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
