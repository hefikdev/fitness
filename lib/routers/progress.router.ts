import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { fitnessPlan, planWorkout, userPlanEnrollment, userWorkoutCompletion, userExerciseCompletion } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

export const progressRouter = router({
  enrollInPlan: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.userPlanEnrollment.findFirst({
        where: and(
          eq(userPlanEnrollment.userId, ctx.session.user.id),
          eq(userPlanEnrollment.planId, input.planId),
          isNull(userPlanEnrollment.completedAt)
        ),
      });
      if (existing) return existing;

      const enrollment = {
        id: randomUUID(),
        userId: ctx.session.user.id,
        planId: input.planId,
      };
      await db.insert(userPlanEnrollment).values(enrollment);
      return enrollment;
    }),

  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return db.query.userPlanEnrollment.findMany({
      where: eq(userPlanEnrollment.userId, ctx.session.user.id),
    });
  }),

  completeWorkout: protectedProcedure
    .input(z.object({ workoutId: z.string(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.userWorkoutCompletion.findFirst({
        where: and(
          eq(userWorkoutCompletion.userId, ctx.session.user.id),
          eq(userWorkoutCompletion.workoutId, input.workoutId)
        ),
      });
      if (existing) return existing;

      const completion = {
        id: randomUUID(),
        userId: ctx.session.user.id,
        workoutId: input.workoutId,
        notes: input.notes ?? null,
      };
      await db.insert(userWorkoutCompletion).values(completion);
      return completion;
    }),

  getCompletedWorkouts: protectedProcedure.query(async ({ ctx }) => {
    const completions = await db.query.userWorkoutCompletion.findMany({
      where: eq(userWorkoutCompletion.userId, ctx.session.user.id),
    });
    return completions.map((c) => c.workoutId);
  }),

  getActivePlan: protectedProcedure.query(async ({ ctx }) => {
    const enrollment = await db.query.userPlanEnrollment.findFirst({
      where: and(
        eq(userPlanEnrollment.userId, ctx.session.user.id),
        isNull(userPlanEnrollment.completedAt)
      ),
    });
    if (!enrollment) return null;

    const plan = await db.query.fitnessPlan.findFirst({
      where: eq(fitnessPlan.id, enrollment.planId),
    });
    if (!plan) return null;

    const totalWorkouts = await db.query.planWorkout.findMany({
      where: eq(planWorkout.planId, plan.id),
    });

    const completions = await db.query.userWorkoutCompletion.findMany({
      where: eq(userWorkoutCompletion.userId, ctx.session.user.id),
    });
    const completedIds = new Set(completions.map((c) => c.workoutId));
    const completedCount = totalWorkouts.filter((w) => completedIds.has(w.id)).length;

    return {
      plan,
      enrollmentId: enrollment.id,
      completedCount,
      totalCount: totalWorkouts.length,
    };
  }),

  markPlanComplete: protectedProcedure
    .input(z.object({ enrollmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const enrollment = await db.query.userPlanEnrollment.findFirst({
        where: and(
          eq(userPlanEnrollment.id, input.enrollmentId),
          eq(userPlanEnrollment.userId, ctx.session.user.id),
          isNull(userPlanEnrollment.completedAt)
        ),
      });
      if (!enrollment) throw new Error("Enrollment not found");
      await db
        .update(userPlanEnrollment)
        .set({ completedAt: new Date() })
        .where(eq(userPlanEnrollment.id, input.enrollmentId));
    }),

  getCompletedExercises: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db.query.userExerciseCompletion.findMany({
      where: eq(userExerciseCompletion.userId, ctx.session.user.id),
    });
    return rows.map((r) => r.exerciseId);
  }),

  toggleExercise: protectedProcedure
    .input(z.object({ exerciseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.userExerciseCompletion.findFirst({
        where: and(
          eq(userExerciseCompletion.userId, ctx.session.user.id),
          eq(userExerciseCompletion.exerciseId, input.exerciseId)
        ),
      });
      if (existing) {
        await db
          .delete(userExerciseCompletion)
          .where(
            and(
              eq(userExerciseCompletion.userId, ctx.session.user.id),
              eq(userExerciseCompletion.exerciseId, input.exerciseId)
            )
          );
        return { checked: false };
      } else {
        await db.insert(userExerciseCompletion).values({
          id: randomUUID(),
          userId: ctx.session.user.id,
          exerciseId: input.exerciseId,
        });
        return { checked: true };
      }
    }),
});
