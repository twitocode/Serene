import { GoogleIcon } from "@/lib/components/auth/google-icon";
import { Button } from "@/lib/components/ui/button";
import { env } from "@/lib/env";
import Link from "next/link";

export default function GoogleButton({serverUrl}: {serverUrl: string}) {
  return (
    <Button
      variant="outline"
      className="inline-flex w-full items-center justify-center space-x-2"
      asChild
    >
      <Link href={serverUrl + `/auth/sign-in/google?returnUrl=${env.NEXT_PUBLIC_SITE_URL}/home`}>
        <GoogleIcon className="size-5" aria-hidden={true} />
        <span className="text-sm font-medium">Sign in with Google</span>
      </Link>
    </Button>
  );
}