import { Hono } from "hono";
import { auth } from "./features/auth/auth";
import authRouter from "./features/auth/auth-router";
import usersRouter from "./features/users/users-router";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each client to 100 requests per window
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "", // Use IP address as key
  })
);
app.use(logger());
app.use(poweredBy());
app.use(prettyJSON())
// Run auth middleware on ALL routes
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
});

app.get("/", (c) => {
  return c.json({})
});


app.route("/auth", authRouter);
app.route("/users", usersRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
