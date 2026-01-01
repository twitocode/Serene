import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
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

export const genderEnum = pgEnum("gender", [
  "Male",
  "Female",
  "Non-Binary",
  "Prefer not to say",
]);

export const themeEnum = pgEnum("theme", ["Dark", "Light"]);

//TODO: Add preferences
export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").unique(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),

  age: integer("age").default(0),
  gender: genderEnum("gender").default("Prefer not to say"),
  pronouns: varchar("pronouns", { length: 50 }).default("They/Them"),
  countryCode: varchar("country_code", { length: 2 }),

  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  onboardingStep: integer("onboarding_step").default(1).notNull(),
  onboardingStarted: boolean("onboarding_started").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Add this alias for Better Auth
// DO NOT DELETE
export const user = usersTable;

export const profilesTable = pgTable("profile", {
  id: text("id").primaryKey(),
  koalaName: text("koala_name").notNull(),
  koalaColour: text("koala_color").default("#5EEAD4").notNull(),
  koalaPronouns: varchar("koala_pronouns", { length: 50 }).default("They/Them"),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),

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

export const preferencesTable = pgTable("preferences", {
  id: text("id").primaryKey(),
  passwordLock: varchar("password_lock", { length: 50 }),
  theme: themeEnum("theme").default("Light"),

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
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  regionCode: varchar("region_code", { length: 2 }), // Province or State
  city: text("city"),
});

export const achievementsTable = pgTable("achievements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  points: integer("points").default(0),
});

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


export type User = InferSelectModel<typeof usersTable>;
export type Profile = InferSelectModel<typeof profilesTable>;
export type Achievement = InferSelectModel<typeof achievementsTable>;
export type UserAchievement = InferSelectModel<typeof userAchievementsTable>;
export type School = InferSelectModel<typeof schoolsTable>;
