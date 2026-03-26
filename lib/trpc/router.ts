import { router } from "@/lib/trpc/init";
import { userRouter } from "@/lib/routers/user.router";
import { plansRouter } from "@/lib/routers/plans.router";
import { progressRouter } from "@/lib/routers/progress.router";

export const appRouter = router({
  user: userRouter,
  plans: plansRouter,
  progress: progressRouter,
});

export type AppRouter = typeof appRouter;
