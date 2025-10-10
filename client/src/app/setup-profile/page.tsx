
// import type { User } from "@/lib/types";
// import { getContext, setContext } from "svelte";

import ProfileSetupForm from "@/lib/components/forms/ProfileSetupForm";

export default function page() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <ProfileSetupForm />
      </div>
    </div>
  );
}