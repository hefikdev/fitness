import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const userProfile = sqliteTable("user_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  goal: text("goal", { enum: ["gain_mass", "lose_weight"] }).notNull(),
  age: integer("age").notNull(),
  gender: text("gender", { enum: ["male", "female", "other"] }).notNull(),
  currentWeightKg: real("current_weight_kg").notNull(),
  onboardingCompleted: integer("onboarding_completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const fitnessPlan = sqliteTable("fitness_plan", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["strength", "cardio", "hiit", "flexibility"] }).notNull(),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  durationWeeks: integer("duration_weeks").notNull(),
  targetGoal: text("target_goal", { enum: ["gain_mass", "lose_weight", "both"] }).notNull(),
  imageSlug: text("image_slug").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const planWorkout = sqliteTable("plan_workout", {
  id: text("id").primaryKey(),
  planId: text("plan_id")
    .notNull()
    .references(() => fitnessPlan.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  imageSlug: text("image_slug").notNull(),
});

export const workoutExercise = sqliteTable("workout_exercise", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => planWorkout.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  durationSeconds: integer("duration_seconds"),
  imageSlug: text("image_slug").notNull(),
});

export const userPlanEnrollment = sqliteTable("user_plan_enrollment", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  planId: text("plan_id")
    .notNull()
    .references(() => fitnessPlan.id, { onDelete: "cascade" }),
  enrolledAt: integer("enrolled_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const userWorkoutCompletion = sqliteTable("user_workout_completion", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => planWorkout.id, { onDelete: "cascade" }),
  completedAt: integer("completed_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  notes: text("notes"),
});

export const userExerciseCompletion = sqliteTable("user_exercise_completion", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const weightEntry = sqliteTable("weight_entry", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  weightKg: real("weight_kg").notNull(),
  recordedAt: integer("recorded_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  notes: text("notes"),
});

export const calorieEntry = sqliteTable("calorie_entry", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  calories: integer("calories").notNull(),
  label: text("label"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const fitnessPlanRelations = relations(fitnessPlan, ({ many }) => ({
  workouts: many(planWorkout),
  enrollments: many(userPlanEnrollment),
}));

export const planWorkoutRelations = relations(planWorkout, ({ one, many }) => ({
  plan: one(fitnessPlan, { fields: [planWorkout.planId], references: [fitnessPlan.id] }),
  exercises: many(workoutExercise),
  completions: many(userWorkoutCompletion),
}));

export const workoutExerciseRelations = relations(workoutExercise, ({ one }) => ({
  workout: one(planWorkout, { fields: [workoutExercise.workoutId], references: [planWorkout.id] }),
}));

export const userPlanEnrollmentRelations = relations(userPlanEnrollment, ({ one }) => ({
  plan: one(fitnessPlan, { fields: [userPlanEnrollment.planId], references: [fitnessPlan.id] }),
}));

export const userWorkoutCompletionRelations = relations(userWorkoutCompletion, ({ one }) => ({
  workout: one(planWorkout, { fields: [userWorkoutCompletion.workoutId], references: [planWorkout.id] }),
}));
