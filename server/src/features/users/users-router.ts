import { Hono } from "hono";
import type { AuthType } from "../auth/auth";

const app = new Hono<{
  Variables: AuthType;
}>();

app.get("/", (c) => {
  return c.json("Hey there");
});

app.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

export default app;
