import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users-schema";

export const questionsOfTheDayTable = pgTable("community-qotd", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postsTable = pgTable("post", {
  id: text("id").primaryKey(),
  answer: text("answer").notNull(),

  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  qotdId: text("qotd_id").references(() => questionsOfTheDayTable.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Relations for postsTable
export const postRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
  qotd: one(questionsOfTheDayTable, {
    fields: [postsTable.qotdId],
    references: [questionsOfTheDayTable.id],
  }),
}));

// Relations for questionsOfTheDayTable (not postsTable!)
export const qotdRelations = relations(questionsOfTheDayTable, ({ many }) => ({
  posts: many(postsTable), // One question has many posts
}));
