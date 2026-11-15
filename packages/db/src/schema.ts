import { pgTable, uuid, text, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("athlete"),
  fitnessLevel: text("fitness_level").notNull().default("beginner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  exercise: text("exercise").notNull().default("squat"),
  status: text("status").notNull().default("in_progress"),
  totalReps: integer("total_reps").notNull().default(0),
  validReps: integer("valid_reps").notNull().default(0),
  averageFormScore: real("average_form_score").notNull().default(100.0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

export const workoutReps = pgTable("workout_reps", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutId: uuid("workout_id").references(() => workouts.id, { onDelete: "cascade" }).notNull(),
  repNumber: integer("rep_number").notNull(),
  durationMs: integer("duration_ms").notNull(),
  minKneeAngle: real("min_knee_angle").notNull(),
  isValidDepth: boolean("is_valid_depth").notNull().default(true),
  formScore: real("form_score").notNull().default(100.0)
});

export const formIssues = pgTable("form_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  repId: uuid("rep_id").references(() => workoutReps.id, { onDelete: "cascade" }).notNull(),
  issue: text("issue").notNull(),
  severity: text("severity").notNull(),
  cue: text("cue").notNull(),
  timestampMs: integer("timestamp_ms").notNull()
});

export const coachingFeedbacks = pgTable("coaching_feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutId: uuid("workout_id").references(() => workouts.id, { onDelete: "cascade" }).notNull(),
  repNumber: integer("rep_number"),
  feedbackText: text("feedback_text").notNull(),
  severity: text("severity").notNull().default("encouragement"),
  generatedAt: timestamp("generated_at").defaultNow().notNull()
});
