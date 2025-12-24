import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users-schema";

export const questionOfTheDay = pgTable("community-qotd", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  answer: text("answer").notNull(),

  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  qotdID: text("qotd_id").references(() => questionOfTheDay.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, { fields: [post.userId], references: [user.id] }),
  qotd: one(questionOfTheDay, {
    fields: [post.qotdID],
    references: [questionOfTheDay.id],
  }),
}));

export const QOTDRelations = relations(post, ({ many }) => ({
  posts: many(post),
}));
