import { Hono } from "hono";
import { cors } from "hono/cors";
import { type AuthType, auth } from "./auth";

const app = new Hono<{
  Variables: AuthType;
}>();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], ["/*"], (c) => {
  return auth.handler(c.req.raw);
});

export default app;
