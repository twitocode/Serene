"use server";
import { setupProfileSchema } from "@/lib/components/auth/formSchema";
import { ValidationError } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as df from "date-fns"

export async function submitProfileSetupForm(formData: FormData) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    username: formData.get("username") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    country: formData.get("country") as string,
    gender: formData.get("gender") as string,
    pronouns: formData.get("pronouns") as string,
    avatarUrl: formData.get("avatarUrl") as string,
  };

  const result = setupProfileSchema.safeParse({
    ...data,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
  });

  if (!result.success) {
    return { success: false };
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;

  // TODO: Do something with the validated form.data
  const res = await fetch(`${process.env.SERVER_URL}/users/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `ACCESS_TOKEN=${accessToken}`,
    },
    body: JSON.stringify({
      ...result.data,
      dateOfBirth: df.format(result.data.dateOfBirth, "yyyy-MM-dd"),
    }),
  });

  if (!res.ok) {
    const errorResponse = (await res.json()) as ValidationError<string>;
    const fieldErrors: Record<string, string> = {};
    console.log(errorResponse);
    return { success: false, fieldErrors };
  }

  console.log("Successfully setup user profile");
  return redirect("/home");
}
