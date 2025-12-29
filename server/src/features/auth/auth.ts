import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/db";
import { env } from "../../env";
import * as schema from "../../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema, // Pass the entire schema object
    usePlural: false, // Better-auth expects singular table names
  }),
  basePath: "/auth",
  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production", // Fix: was "PRODUCTION"
      sameSite: "lax", // Add this for better cookie handling
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: env.BETTER_AUTH_SECRET,
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
