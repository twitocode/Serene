"use server";
import { loginSchema } from "@/lib/components/auth/formSchema";
import { setAuthTokens } from "@/lib/server/setAuthTokens";
import { ApiAppError } from "@/lib/types";
import { AppErrors } from "@/lib/types/application-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface LoginFormError {
  success: boolean;
  fieldErrors: Record<string, string>;
}
export async function submitLoginForm(formData: FormData): Promise<LoginFormError> {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return { success: false, fieldErrors:{}};
  }

  // TODO: Do something with the validated form.data
  const res = await fetch(`${process.env.SERVER_URL}/auth/login`, {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify(result.data),
  });

  if (!res.ok) {
    const errorResponse = (await res.json()) as ApiAppError;
    const fieldErrors: Record<string, string> = {};

    for (const error of errorResponse.errors) {
      if (error.code == AppErrors.UserNotFound) {
        fieldErrors.email = error.message;
      } else if (error.code == AppErrors.AuthInvalidPassword) {
        fieldErrors.password = error.message;
      }
    }

    return { success: false, fieldErrors };
  }

  const cookieStore = await cookies();
  setAuthTokens(cookieStore, res);

  console.log("Login successful, redirecting to callback");
  return redirect("/home");
}
