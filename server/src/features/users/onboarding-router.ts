import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v4 } from "uuid";
import { db } from "../../db/db";
import {
  profilesTable,
  schoolsTable,
  usersTable,
} from "../../db/schema/users-schema";
import { authMiddleware } from "../../middleware/auth-middleware";
import { type AuthType } from "../auth/auth";

async function validateStep(userId: string, requiredStep: number) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: { onboardingStep: true },
  });

  if (!user || user.onboardingStep < requiredStep) {
    throw new HTTPException(400, {
      message: "You must complete previous steps first.",
    });
  }
}

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
      onboardingStarted: true,
    },
  });
  if (!user) {
    throw new HTTPException(500, { message: "User should exist but does not" });
  }

  console.log(user);

  return c.json({
    step: user.onboardingStep,
    completed: user.onboardingCompleted,
    started: user.onboardingStarted,
  });
});

app.post("/step1", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();
  await validateStep(sessionUser.id, 1);

  await db
    .update(usersTable)
    .set({
      name: body.name,
      onboardingStep: 2,
      onboardingStarted: true,
    })
    .where(eq(usersTable.id, sessionUser.id));

  return c.json({ success: true });
});

app.post("/step2", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();
  await validateStep(sessionUser.id, 2);

  await db
    .update(usersTable)
    .set({
      age: body.age,
      gender: body.gender === "" ? "Prefer not to say" : body.gender,
      pronouns: body.pronouns,
      onboardingStep: 3,
    })
    .where(eq(usersTable.id, sessionUser.id));

  return c.json({ success: true });
});

app.post("/step3", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();
  await validateStep(sessionUser.id, 3);

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
  await validateStep(sessionUser.id, 4);

  console.log(body);
  await db.transaction(async (tx) => {
    let school = await tx.query.schoolsTable.findFirst({
      where: eq(schoolsTable.name, body.name),
    });

    if (!school) {
      const [newSchool] = await tx
        .insert(schoolsTable)
        .values({
          id: v4(),
          name: body.name,
          countryCode: body.countryCode,
          city: body.city,
          regionCode: body.regionCode,
        })
        .returning();
      school = newSchool;
    }

    await tx
      .update(profilesTable)
      .set({ schoolId: school.id })
      .where(eq(profilesTable.userId, sessionUser.id));

    await tx
      .update(usersTable)
      .set({
        onboardingStep: 5,
      })
      .where(eq(usersTable.id, sessionUser.id));
  });

  return c.json({ success: true });
});

app.post("/step5", authMiddleware, async (c) => {
  const sessionUser = c.get("user")!;
  const body = await c.req.json();
  await validateStep(sessionUser.id, 5);

  await db
    .update(usersTable)
    .set({
      onboardingCompleted: true,
      onboardingStep: -1,
    })
    .where(eq(usersTable.id, sessionUser.id));

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

export default app;
