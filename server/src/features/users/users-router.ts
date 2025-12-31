import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db/db";
import { usersTable } from "../../db/schema/users-schema";
import type { AuthType } from "../auth/auth";

const app = new Hono<{
  Variables: AuthType;
}>();

app.get("/me", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  console.log(session, user)
  return c.json({
    session,
    user,
  });
});

app.get("/exists/:email", async (c) => {
  const email = c.req.param("email");
  if (!email) {
    throw new HTTPException(403, { message: "User ID not provided" });
  }

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return c.json({ exists: result.length > 0 });
});
export default app;
