import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { db } from "../../db/db";
import { user, usersTable } from "../../db/schema/users-schema";
import { zodValidator } from "../../middleware/zodValidator";
import { RouterVariables } from "../../types";

const app = new Hono<{
  Variables: RouterVariables;
}>();

app.get("/me", async (c) => {
  const session = c.get("session");
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session!.userId),
    columns: {
      email: true,
      image: true,
      name: true,
    },
    with: {
      profile: {
        columns: {
          koalaColour: true,
          koalaName: true,
          koalaPronouns: true,
          longestStreak: true,
          currentStreak: true,
        },
      },
    },
  });
  return c.json({
    user: userData,
  });
});

const emailExistsSchema = z.object({
  email: z.email("Not an email"),
});

app.get(
  "/exists/:email",
  zodValidator("param", emailExistsSchema),
  async (c) => {
    const email = c.req.param("email");
    if (!email) {
      c.var.logger.info(`User does not exist with email ${email}`);
      throw new HTTPException(403, { message: "User ID not provided" });
    }

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return c.json({ exists: result.length > 0 });
  }
);
export default app;
