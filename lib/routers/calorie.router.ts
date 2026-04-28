import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { calorieEntry } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export const calorieRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        calories: z.number().int().min(1).max(10000),
        label: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = {
        id: randomUUID(),
        userId: ctx.session.user.id,
        date: input.date,
        calories: input.calories,
        label: input.label ?? null,
      };
      await db.insert(calorieEntry).values(entry);
      return entry;
    }),

  listByDate: protectedProcedure
    .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
    .query(async ({ ctx, input }) => {
      return db.query.calorieEntry.findMany({
        where: and(
          eq(calorieEntry.userId, ctx.session.user.id),
          eq(calorieEntry.date, input.date)
        ),
        orderBy: [desc(calorieEntry.createdAt)],
      });
    }),

  listRecent: protectedProcedure.query(async ({ ctx }) => {
    return db.query.calorieEntry.findMany({
      where: eq(calorieEntry.userId, ctx.session.user.id),
      orderBy: [desc(calorieEntry.createdAt)],
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(calorieEntry)
        .where(and(eq(calorieEntry.id, input.id), eq(calorieEntry.userId, ctx.session.user.id)));
    }),
});
