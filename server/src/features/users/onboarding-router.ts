import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../../db/db";
import { profilesTable, usersTable } from "../../db/schema/users-schema";
import { authMiddleware } from "../../middleware/auth-middleware";
import { type AuthType } from "../auth/auth";

const app = new Hono<{
  Variables: AuthType;
}>();

app.get("/", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, sessionUser.id),
    columns: {
      onboardingCompleted: true,
      onboardingStep: true,
    },
  });
  if (!user) {
    throw new HTTPException(500, { message: "User should exist but does not" });
  }

  console.log(user);

  return c.json({
    step: user.onboardingStep,
    completed: user.onboardingCompleted,
  });
});

app.post("/step1", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();

  await db
    .update(usersTable)
    .set({
      name: body.name,
      onboardingStep: 2,
    })
    .where(eq(usersTable.id, sessionUser.id));

  return c.json({ success: true });
});

app.post("/step2", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();

  await db
    .update(usersTable)
    .set({
      age: body.age,
      gender: body.gender,
      pronouns: body.pronouns,
      onboardingStep: 3,
    })
    .where(eq(usersTable.id, sessionUser.id));

  return c.json({ success: true });
});

app.post("/step3", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();

  await db
    .update(usersTable)
    .set({
      countryCode: body.countryCode,
      onboardingStep: 4,
    })
    .where(eq(usersTable.id, sessionUser.id));

  return c.json({ success: true });
});

app.post("/step4", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();

  await db
    .update(profilesTable)
    .set({
      koalaName: body.koalaName,
      koalaPronouns: body.koalaPronouns,
      koalaColour: body.koalaColour,
    })
    .where(eq(profilesTable.userId, sessionUser.id));

  return c.json({ success: true });
});

app.post("/complete", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;

  await db
    .update(usersTable)
    .set({ onboardingCompleted: true })
    .where(eq(usersTable.id, sessionUser.id));
  return c.json({ success: true });
});

export default app;
