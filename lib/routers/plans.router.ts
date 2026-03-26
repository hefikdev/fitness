import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { fitnessPlan, planWorkout, workoutExercise } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const plansRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        category: z
          .enum(["strength", "cardio", "hiit", "flexibility", "all"])
          .optional()
          .default("all"),
      })
    )
    .query(async ({ input }) => {
      const plans = await db.select().from(fitnessPlan);
      if (input.category === "all") return plans;
      return plans.filter((p) => p.category === input.category);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const plan = await db.query.fitnessPlan.findFirst({
        where: eq(fitnessPlan.id, input.id),
        with: {
          workouts: {
            orderBy: asc(planWorkout.dayNumber),
            with: {
              exercises: {
                orderBy: asc(workoutExercise.order),
              },
            },
          },
        },
      });
      if (!plan) throw new Error("Plan not found");
      return plan;
    }),
});
