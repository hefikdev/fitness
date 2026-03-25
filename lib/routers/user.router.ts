import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, ctx.session.user.id),
    });
    return profile ?? null;
  }),

  saveOnboarding: protectedProcedure
    .input(
      z.object({
        goal: z.enum(["gain_mass", "lose_weight"]),
        age: z.number().int().min(10).max(120),
        gender: z.enum(["male", "female", "other"]),
        currentWeightKg: z.number().min(20).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, ctx.session.user.id),
      });

      if (existing) {
        await db
          .update(userProfile)
          .set({ ...input, onboardingCompleted: true, updatedAt: new Date() })
          .where(eq(userProfile.userId, ctx.session.user.id));
      } else {
        await db.insert(userProfile).values({
          id: randomUUID(),
          userId: ctx.session.user.id,
          ...input,
          onboardingCompleted: true,
        });
      }
    }),
});
