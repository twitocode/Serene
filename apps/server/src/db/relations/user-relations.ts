import { relations } from "drizzle-orm";
import * as authSchema from "../schema/auth-schema";
import * as checkinSchema from "../schema/checkin-schema";
import * as communitySchema from "../schema/community-schema";
import * as usersSchema from "../schema/users-schema";

export const userRelations = relations(
  usersSchema.usersTable,
  ({ one, many }) => ({
    sessions: many(authSchema.sessionsTable),
    accounts: many(authSchema.accountsTable),
    profile: one(usersSchema.profilesTable, {
      fields: [usersSchema.usersTable.id],
      references: [usersSchema.profilesTable.userId],
    }),
    preferences: one(usersSchema.preferencesTable, {
      fields: [usersSchema.usersTable.id],
      references: [usersSchema.preferencesTable.userId],
    }),
    safetyPlan: one(usersSchema.safetyPlansTable, {
      fields: [usersSchema.usersTable.id],
      references: [usersSchema.safetyPlansTable.userId],
    }),
    posts: many(communitySchema.postsTable),
    checkins: many(checkinSchema.checkinsTable),
    userAchievements: many(usersSchema.userAchievementsTable),
  })
);

export const profileRelations = relations(
  usersSchema.profilesTable,
  ({ one }) => ({
    user: one(usersSchema.usersTable, {
      fields: [usersSchema.profilesTable.userId],
      references: [usersSchema.usersTable.id],
    }),
    school: one(usersSchema.schoolsTable, {
      fields: [usersSchema.profilesTable.schoolId],
      references: [usersSchema.schoolsTable.id],
    }),
  })
);

export const preferenceRelations = relations(
  usersSchema.preferencesTable,
  ({ one }) => ({
    user: one(usersSchema.usersTable, {
      fields: [usersSchema.preferencesTable.userId],
      references: [usersSchema.usersTable.id],
    }),
  })
);

export const safetyPlanRelations = relations(
  usersSchema.safetyPlansTable,
  ({ one }) => ({
    user: one(usersSchema.usersTable, {
      fields: [usersSchema.safetyPlansTable.userId],
      references: [usersSchema.usersTable.id],
    }),
  })
);

export const schoolRelations = relations(
  usersSchema.schoolsTable,
  ({ many }) => ({
    profiles: many(usersSchema.profilesTable),
  })
);

export const userAchievementsRelations = relations(
  usersSchema.userAchievementsTable,
  ({ one }) => ({
    user: one(usersSchema.usersTable, {
      fields: [usersSchema.userAchievementsTable.userId],
      references: [usersSchema.usersTable.id],
    }),
    achievement: one(usersSchema.achievementsTable, {
      fields: [usersSchema.userAchievementsTable.achievementId],
      references: [usersSchema.achievementsTable.id],
    }),
  })
);

export const achievementsRelations = relations(
  usersSchema.achievementsTable,
  ({ many }) => ({
    userAchievements: many(usersSchema.userAchievementsTable),
  })
);
