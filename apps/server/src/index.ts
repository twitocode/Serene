import { Hono } from "hono";
import { PinoLogger, pinoLogger } from "hono-pino";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import z, { ZodError } from "zod";
import { auth } from "./lib/auth";
import { AppError } from "./lib/errors";
import onboardingRouter from "./modules/onboarding/onboarding.router";
import usersRouter from "./modules/users/users.router";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    logger: PinoLogger;
  };
}>();

const transport = process.stdout.isTTY
  ? { transport: { target: "pino-pretty", options: { colorize: true } } }
  : {};

app.use(
  pinoLogger({
    pino: {
      ...transport,
      serializers: {
        req: (req) => ({ method: req.method, url: req.url, cookie: req.cookies }),
        res: (res) => ({ status: res.status }),
      },
    },
  })
);

app.onError((err, c) => {
  // 1. Handle our custom Application Errors
  if (err instanceof AppError) {
    console.log(err);
    return c.json(
      {
        success: false,
        message: err.message,
        code: err.code,
      },
      err.status
    );
  }

  // 2. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        issues: z.treeifyError(err),
      },
      400
    );
  }

  // 3. Handle Standard Hono Errors
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        code: "HTTP_ERROR",
      },
      err.status
    );
  }

  // 4. Handle unexpected crashes (500)
  console.error("Unhandled Error:", err);
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
      code: "SERVER_ERROR",
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
    },
  })
);

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

  c.var.logger.debug(`UserId: ${session?.user.id ?? "User not signed in"}`);
  await next();
});

app.get("/", (c) => {
  return c.text("You should not be here");
});

app.route("/users", usersRouter);
app.route("/users/onboarding", onboardingRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
