import { router } from "@/lib/trpc/init";
import { userRouter } from "@/lib/routers/user.router";
import { plansRouter } from "@/lib/routers/plans.router";
import { progressRouter } from "@/lib/routers/progress.router";
import { weightRouter } from "@/lib/routers/weight.router";

export const appRouter = router({
  user: userRouter,
  plans: plansRouter,
  progress: progressRouter,
  weight: weightRouter,
});

export type AppRouter = typeof appRouter;
