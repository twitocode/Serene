"use client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import DiscordIcon from "./DiscordIcon";
import GoogleIcon from "./GoogleIcon";
import FieldInfo from "./FieldInfo";
import { z } from "zod";
import { formOpts, userSchema } from "./form";

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      onChange: userSchema,
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account for Serene</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="email"
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  placeholder="m@example.com"
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div className="grid gap-2">
          <form.Field
            name="password"
            children={(field) => (
              <>
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create Account"}
            </Button>
          )}
        />
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            <DiscordIcon />
            <span className="sr-only">Login with Discord</span>
          </Button>
          <Button variant="outline" className="w-full">
            <GoogleIcon />
            <span className="sr-only">Login with Google</span>
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
