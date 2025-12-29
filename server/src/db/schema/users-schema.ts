import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { accountsTable, sessionsTable } from "./auth-schema";
import { checkinsTable } from "./checkin-schema";
import { postsTable } from "./community-schema";

//TODO: Add preferences
export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Add this alias for Better Auth
// DO NOT DELETE
export const user = usersTable;

export const genderEnum = pgEnum("gender", [
  "Male",
  "Female",
  "Non-Binary",
  "Prefer not to say",
]);

export const profilesTable = pgTable("profile", {
  id: text("id").primaryKey(),
  koalaName: text("koala_name").notNull(),
  koalaColor: text("koala_color").default("#5EEAD4").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  gender: genderEnum("gender").notNull(),
  pronouns: varchar("pronouns", { length: 50 }).notNull(),
  dateOfBirth: date("dob").notNull(),
  schoolId: text("school_id").references(() => schoolsTable.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const safetyPlansTable = pgTable("safety_plan", {
  // Fixed table name
  id: text("id").primaryKey(),
  professionalResources: jsonb("professional_resources"),
  safeContacts: jsonb("safe_contacts"),
  copingStrategies: text("coping_strategies")
    .array()
    .default(sql`ARRAY[]::text[]`),
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

//TODO: add american schools
export const schoolsTable = pgTable("school", {
  id: text("id").primaryKey(),
  name: text("name"),
});

// --- THE MASTER RELATIONSHIP DEFINITION ---
export const userRelations = relations(usersTable, ({ one, many }) => ({
  // Auth Relationships
  sessions: many(sessionsTable),
  accounts: many(accountsTable),

  // App Relationships
  profile: one(profilesTable, {
    fields: [usersTable.id],
    references: [profilesTable.userId],
  }),
  safetyPlan: one(safetyPlansTable, {
    fields: [usersTable.id],
    references: [safetyPlansTable.userId],
  }),
  posts: many(postsTable),
  checkins: many(checkinsTable),
  userAchievements: many(userAchievementsTable),
}));

export const achievementsTable = pgTable("achievements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  points: integer("points").default(0),
});

// --- Inverse Relationships ---

export const profileRelations = relations(profilesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [profilesTable.userId],
    references: [usersTable.id],
  }),
  school: one(schoolsTable, {
    fields: [profilesTable.schoolId],
    references: [schoolsTable.id],
  }),
}));

export const safetyPlanRelations = relations(safetyPlansTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [safetyPlansTable.userId],
    references: [usersTable.id],
  }),
}));

export const schoolRelations = relations(schoolsTable, ({ many }) => ({
  profiles: many(profilesTable),
}));

export const userAchievementsTable = pgTable(
  "user_achievements",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    achievementId: text("achievement_id")
      .notNull()
      .references(() => achievementsTable.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.achievementId] }),
  })
);
