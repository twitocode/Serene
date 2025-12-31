import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v4 } from "uuid";
import z from "zod";
import { db } from "../../db/db";
import {
  profilesTable,
  schoolsTable,
  usersTable,
} from "../../db/schema/users-schema";
import { SUPPORTED_COUNTRY_CODES } from "../../helpers/get-country-codes";
import { authMiddleware } from "../../middleware/auth-middleware";
import { zodValidator } from "../../middleware/zodValidator";
import { RouterVariables } from "../../types";

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
  Variables: RouterVariables;
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
    c.var.logger.error(`User ${sessionUser.email} should exist but does not`);
    throw new HTTPException(500, { message: "User should exist but does not" });
  }

  return c.json({
    step: user.onboardingStep,
    completed: user.onboardingCompleted,
    started: user.onboardingStarted,
  });
});

export const stepOneSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, hyphens"),
});

app.post(
  "/step1",
  authMiddleware,
  zodValidator("json", stepOneSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");
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
  }
);

const pronounsRegex =
  /^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$/i;

export const stepTwoSchema = z.object({
  age: z
    .number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Non-Binary", "Prefer not to say"], {
    message: "Please select a gender",
  }),
  pronouns: z.string().regex(pronounsRegex, "Invalid pronouns").optional(),
});

app.post(
  "/step2",
  authMiddleware,
  zodValidator("json", stepTwoSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");
    await validateStep(sessionUser.id, 2);

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
  }
);

export const stepThreeSchema = z.object({
  countryCode: z.string().min(1, "Country is required"),
});

app.post(
  "/step3",
  authMiddleware,
  zodValidator("json", stepThreeSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");
    await validateStep(sessionUser.id, 3);

    await db
      .update(usersTable)
      .set({
        countryCode: body.countryCode,
        onboardingStep: 4,
      })
      .where(eq(usersTable.id, sessionUser.id));

    return c.json({ success: true });
  }
);

export const stepFourSchema = z.object({
  name: z
    .string()
    .min(1, "School is required")
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be less than 100 characters"),
  countryCode: z.enum(SUPPORTED_COUNTRY_CODES, {
    error: () => ({ message: "Please select a supported country" }),
  }),
  city: z.string("City not provided"),
  regionCode: z
    .string("Region code not provided")
    .length(3, "Not a region code"),
});

app.post(
  "/step4",
  authMiddleware,
  zodValidator("json", stepFourSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");
    await validateStep(sessionUser.id, 4);

    await db.transaction(async (tx) => {
      let school = await tx.query.schoolsTable.findFirst({
        where: eq(schoolsTable.name, body.name),
      });

      if (!school) {
        c.var.logger.info(`Adding School Record: ${body.name}`);
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
  }
);

export const stepFiveSchema = z.object({
  koalaName: z
    .string()
    .min(1, "Koala name is required")
    .min(2, "Koala name must be at least 2 characters")
    .max(30, "Koala name must be less than 30 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Koala name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  koalaColour: z.enum(["Gray", "Brown", "White", "Black", "Cream", "Tan"], {
    message: "Please select a color for your koala",
  }),
  koalaPronouns: z
    .string()
    .max(50, "Koala pronouns must be less than 50 characters")
    .optional(),
});

app.post(
  "/step5",
  authMiddleware,
  zodValidator("json", stepFiveSchema),
  async (c) => {
    const sessionUser = c.get("user")!;
    const body = await c.req.valid("json");
    await validateStep(sessionUser.id, 5);

    await db.transaction(async (tx) => {
      await tx
        .update(usersTable)
        .set({
          onboardingCompleted: true,
          onboardingStep: -1,
        })
        .where(eq(usersTable.id, sessionUser.id));

      await tx
        .update(profilesTable)
        .set({
          koalaName: body.koalaName,
          koalaPronouns: body.koalaPronouns,
          koalaColour: body.koalaColour,
        })
        .where(eq(profilesTable.userId, sessionUser.id));
    });

    return c.json({ success: true });
  }
);

export default app;
