import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  if (!cookieStore.get("ACCESS_TOKEN")) {
    console.log("No access token found, redirecting to login");
    throw redirect("/login");
  }

  return redirect("/home");
}
