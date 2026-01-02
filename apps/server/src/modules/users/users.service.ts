import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { user, usersTable } from "../../db/schema";
import { AppError } from "../../lib/errors";
import { getDbErrorMessage } from "../../db/db-error-utils";

export async function getUserProfile(
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  } | null
) {
  if (!session) {
    throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
  }

  try {
    const userData = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, session.userId),
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
        preferences: {
          columns: {
            passwordLock: true,
            theme: true,
          },
        },
      },
    });

    if (!userData) {
      throw new AppError(404, "User profile not found", "USER_NOT_FOUND");
    }

    return userData;
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

export async function doesUserExist(email: string) {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return result.length > 0;
  } catch (error) {
    const { message, constraint } = getDbErrorMessage(error);
    console.error("Database operation failed:", {
      message,
      constraint,
      originalError: error,
    });
    throw new AppError(500, message, "DB_ERROR");
  }
}
