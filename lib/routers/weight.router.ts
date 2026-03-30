import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { weightEntry } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export const weightRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.query.weightEntry.findMany({
      where: eq(weightEntry.userId, ctx.session.user.id),
      orderBy: desc(weightEntry.recordedAt),
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        weightKg: z.number().min(20).max(500),
        notes: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = {
        id: randomUUID(),
        userId: ctx.session.user.id,
        weightKg: input.weightKg,
        notes: input.notes ?? null,
      };
      await db.insert(weightEntry).values(entry);
      return entry;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(weightEntry)
        .where(
          and(
            eq(weightEntry.id, input.id),
            eq(weightEntry.userId, ctx.session.user.id)
          )
        );
    }),
});
