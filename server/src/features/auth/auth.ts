import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/db";
import { env } from "../../env";
import * as schema from "../../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema, 
    usePlural: false, 
  }),
  basePath: "/auth",
  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
    },
  },
  trustedOrigins: ["http://localhost:3000"], 
  baseURL: "http://localhost:8000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: env.BETTER_AUTH_SECRET,
});

