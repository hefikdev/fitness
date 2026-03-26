import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { userPlanEnrollment, userWorkoutCompletion } from "@/lib/db/schema";
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
});
