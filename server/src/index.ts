import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import { auth } from "./features/auth/auth";
import authRouter from "./features/auth/auth-router";
import onboardingRouter from "./features/users/onboarding-router";
import usersRouter from "./features/users/users-router";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        status: err.status,
      },
      err.status
    );
  }

  console.error("Unexpected error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});



app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each client to 100 requests per window
    keyGenerator: (c) => {
      const ip = c.req.header("x-forwarded-for") ?? "127.0.0.1";
      // Allow internal traffic to bypass the limit
      if (ip === "::1" || ip === "127.0.0.1" || ip.includes("localhost")) {
        return Math.random().toString();
      }
      return ip;
    }
  })
);
app.use(logger());
app.use(poweredBy());
app.use(prettyJSON());

app.use("*", async (c, next) => {
  const path = c.req.path;
  
  if (path.startsWith("/auth")) {
    return next();
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
});

app.get("/", (c) => {
  return c.json({});
});

//DONT NEED THIS FOR BETTER AUTH
// app.route("/auth", authRouter);
app.route("/users", usersRouter);
app.route("/users/onboarding", onboardingRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
