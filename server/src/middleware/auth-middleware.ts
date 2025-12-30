import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { auth } from "../features/auth/auth";

export const authMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  
  if (!user || !session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  await next();
});