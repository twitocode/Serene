import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    INTERNAL_SERVER_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    INTERNAL_SERVER_URL: process.env.INTERNAL_SERVER_URL,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
