import type { User } from "@/lib/types";
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

const defaultUser: User = { email: "", password: "" };

export const userSchema = z.object({
  email: z.string().email("Enter in a valid email address."),
  password: z.string().min(6, "Password must be 6 characters long."),
});

const defaultValues: z.input<typeof userSchema> = {
  email: "",
  password: "",
};

export const formOpts = formOptions({
  defaultValues: defaultUser
});
