import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { session, account } from "./auth-schema";
import { checkin } from "./checkin-schema";
import { post } from "./community-schema";

export const user = pgTable("user", {
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

export const profile = pgTable("profile", {
  id: text("id").primaryKey(),
  koalaName: text("koala_name").notNull(), // Your Panda is now a Koala!
  koalaColor: text("koala_color").default("#5EEAD4"), // Added for customization
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const safetyPlan = pgTable("safety-plan", {
  id: text("id").primaryKey(),
  professionalResources: jsonb("pro-resources"),
  safeContacts: jsonb("safe-contacts"),
  copingStrategies: text("coping_strategies")
    .array()
    .default(sql`ARRAY[]::text[]`),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --- THE MASTER RELATIONSHIP DEFINITION ---
export const userRelations = relations(user, ({ one, many }) => ({
  // Auth Relationships
  sessions: many(session),
  accounts: many(account),

  // App Relationships
  profile: one(profile, {
    fields: [user.id],
    references: [profile.userId],
  }),
  safetyPlan: one(safetyPlan, {
    fields: [user.id],
    references: [safetyPlan.userId],
  }),
  posts: many(post),
  checkins: many(checkin),
  userAchievements: many(userAchievements),
}));

// --- Inverse Relationships ---

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const safetyPlanRelations = relations(safetyPlan, ({ one }) => ({
  user: one(user, { fields: [safetyPlan.userId], references: [user.id] }),
}));

// Keep your Achievements & userAchievements tables here as well...
export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  points: integer("points").default(0),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    achievementId: text("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.achievementId] }),
  })
);
