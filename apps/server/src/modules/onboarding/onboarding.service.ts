import { User } from "better-auth";
import { eq } from "drizzle-orm";
import { PinoLogger } from "hono-pino";
import { HTTPException } from "hono/http-exception";
import { v4 } from "uuid";
import { db } from "../../db/db";
import {
  preferencesTable,
  profilesTable,
  schoolsTable,
  usersTable,
} from "../../db/schema";
import {
  StepFiveSchema,
  StepFourSchema,
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema,
} from "@serene/shared/validation/onboarding.schema";

export async function validateStep(userId: string, requiredStep: number) {
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

export async function submitStep1(body: StepOneSchema, sessionUser: User) {
  await db
    .update(usersTable)
    .set({
      name: body.name,
      onboardingStep: 2,
      onboardingStarted: true,
    })
    .where(eq(usersTable.id, sessionUser.id));
}

export async function submitStep2(body: StepTwoSchema, sessionUser: User) {
  await db
    .update(usersTable)
    .set({
      age: body.age,
      gender: body.gender,
      pronouns: body.pronouns,
      onboardingStep: 3,
    })
    .where(eq(usersTable.id, sessionUser.id));
}

export async function submitStep3(body: StepThreeSchema, sessionUser: User) {
  await validateStep(sessionUser.id, 3);

  await db
    .update(usersTable)
    .set({
      countryCode: body.countryCode,
      onboardingStep: 4,
    })
    .where(eq(usersTable.id, sessionUser.id));
}

export async function submitStep4(
  body: StepFourSchema,
  logger: PinoLogger,
  sessionUser: User
) {
  await db.transaction(async (tx) => {
    let school = await tx.query.schoolsTable.findFirst({
      where: eq(schoolsTable.name, body.name),
    });

    if (!school) {
      logger.info(`Adding School Record: ${body.name}`);
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
}

export async function submitStep5(sessionUser: User, body: StepFiveSchema) {
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

    await tx.insert(preferencesTable).values({
      id: v4(),
      userId: sessionUser.id,
      theme: "Light",
    });
  });
}
