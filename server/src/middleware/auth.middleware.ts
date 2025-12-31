import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
});
