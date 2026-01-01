import { createMiddleware } from "hono/factory";
import { AppError } from "../lib/errors";

export const authMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
  }

  await next();
});
