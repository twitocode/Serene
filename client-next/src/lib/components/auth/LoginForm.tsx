"use client";

import { submitLoginForm } from "@/lib/actions/submitLoginForm";
import { LoginFormSchema, loginSchema } from "@/lib/components/auth/formSchema";
import GoogleIcon from "@/lib/components/auth/GoogleIcon";
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
import { useOrigin } from "@/lib/hooks/useOrigin";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEndIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  isLogin?: boolean;
  className?: string;
  SERVER_URL: string;
}

export default function LoginForm({ isLogin, SERVER_URL, className }: Props) {
  const origin = useOrigin()

  const form = useForm<z.infer<LoginFormSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<LoginFormSchema>) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await submitLoginForm(formData);

    if (!result?.success) {
      if (result?.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as "email" | "password", {
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
              {isLogin ? <>Login to Serene</> : <>Sign Up for Serene</>}
            </h1>
            {isLogin ? (
              <div className="text-center text-sm">
                Don&apos;t have an account?
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            ) : (
              <div className="text-center text-sm">
                Already have an account?
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The email you will use for logging in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="me@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The email you will use for logging in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? <>Login</> : <>Sign Up</>}
              {form.formState.isSubmitting && <>Loading</>}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" type="button" className="w-full">
              <a
                href={`${SERVER_URL}/auth/login/google?returnUrl=${origin}/login/callback`}
                className="w-full flex items-center space-x-2 justify-center"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs">
          By clicking continue, you agree to our{" "}
          <a href="##">Terms of Service</a>
          and <a href="##">Privacy Policy</a>.
        </div>
      </form>
    </Form>
  );
}
