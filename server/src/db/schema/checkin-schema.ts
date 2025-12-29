import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users-schema";

// Define what a single "feeling" looks like on the grid
export type GridPoint = {
  x: number; // 0-100 (Unpleasant -> Pleasant)
  y: number; // 0-100 (Low Energy -> High Energy)
  label?: string; // Optional inferred label (e.g., "Anxious")
};

// Define the map structure: Key = Body Part, Value = GridPoint
// Example: { "chest": { x: 20, y: 80 }, "head": { x: 50, y: 50 } }
export type SomaticMap = Record<string, GridPoint>;

export const checkinsTable = pgTable("checkins", {
  id: text("id").primaryKey(),

  // FIXED: Added user relationship column
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  moodLabel: text("mood_label").notNull(),
  moodSeverity: integer("mood_severity").notNull().default(5),
  promptQuestion: text("prompt_question").notNull(),
  promptAnswer: text("prompt_answer").default(""),

  somaticState: jsonb("somatic_state").$type<SomaticMap>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const checkinRelations = relations(checkinsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [checkinsTable.userId],
    references: [usersTable.id],
  }),
}));
