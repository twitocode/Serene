import { AppError } from "../../lib/errors";
import { getDbErrorMessage } from "../../db/db-error-utils";
import {
  StepFiveSchema,
  StepFourSchema,
  StepOneSchema,
  StepThreeSchema,
  StepTwoSchema,
} from "@serene/shared/validation";
import { User } from "better-auth";
import { eq } from "drizzle-orm";
import { PinoLogger } from "hono-pino";
import { v4 } from "uuid";
import { db } from "../../db/db";
import {
  preferencesTable,
  profilesTable,
  schoolsTable,
  usersTable,
} from "../../db/schema";

export async function validateStep(userId: string, requiredStep: number) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: { onboardingStep: true },
  });

  if (!user) {
    throw new AppError(404, "User profile not found", "USER_NOT_FOUND");
  }

  if (user.onboardingStep < requiredStep) {
    throw new AppError(
      400,
      "You must complete previous steps first.",
      "INVALID_STEP_ORDER"
    );
  }
}

export async function submitStep1(body: StepOneSchema, sessionUser: User) {
  try {
    const result = await db
      .update(usersTable)
      .set({
        name: body.name,
        onboardingStep: 2,
        onboardingStarted: true,
      })
      .where(eq(usersTable.id, sessionUser.id))
      .returning({ updatedId: usersTable.id });

    if (result.length === 0) {
      throw new AppError(404, "User not found during update", "USER_MISSING");
    }
  } catch (error) {
    console.error(error)
    if (error instanceof AppError) {
      throw error;
    }

    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });

    if (constraint?.includes("duplicate")) {
      throw new AppError(409, message, "USERNAME_TAKEN");
    }

    throw new AppError(500, message, "DB_ERROR");
  }
}

export async function submitStep2(body: StepTwoSchema, sessionUser: User) {
  try {
    const result = await db
      .update(usersTable)
      .set({
        age: body.age,
        gender: body.gender,
        pronouns: body.pronouns,
        onboardingStep: 3,
      })
      .where(eq(usersTable.id, sessionUser.id))
      .returning({ updatedId: usersTable.id });

    if (result.length === 0) {
      throw new AppError(404, "User not found during update", "USER_MISSING");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });
    throw new AppError(500, message, "DB_ERROR");
  }
}

export async function submitStep3(body: StepThreeSchema, sessionUser: User) {
  try {
    const result = await db
      .update(usersTable)
      .set({
        countryCode: body.countryCode,
        onboardingStep: 4,
      })
      .where(eq(usersTable.id, sessionUser.id))
      .returning({ updatedId: usersTable.id });

    if (result.length === 0) {
      throw new AppError(404, "User not found during update", "USER_MISSING");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });
    throw new AppError(500, message, "DB_ERROR");
  }
}

export async function submitStep4(
  body: StepFourSchema,
  logger: PinoLogger,
  sessionUser: User
) {
  try {
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

      const result = await tx
        .update(usersTable)
        .set({
          onboardingStep: 5,
        })
        .where(eq(usersTable.id, sessionUser.id))
        .returning({ updatedId: usersTable.id });

      if (result.length === 0) {
        throw new AppError(404, "User not found during update", "USER_MISSING");
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });
    throw new AppError(500, message, "DB_ERROR");
  }
}

export async function submitStep5(sessionUser: User, body: StepFiveSchema) {
  try {
    await db.transaction(async (tx) => {
      const result = await tx
        .update(usersTable)
        .set({
          onboardingCompleted: true,
          onboardingStep: -1,
        })
        .where(eq(usersTable.id, sessionUser.id))
        .returning({ updatedId: usersTable.id });

      if (result.length === 0) {
        throw new AppError(404, "User not found during update", "USER_MISSING");
      }

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
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });
    throw new AppError(500, message, "DB_ERROR");
  }
}
