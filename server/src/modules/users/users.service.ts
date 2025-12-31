import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { user, usersTable } from "../../db/schema";

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

  return userData
}

export async function doesUserExist(email: string) {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

    return result.length >0 
}
