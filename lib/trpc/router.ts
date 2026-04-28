import { router } from "@/lib/trpc/init";
import { userRouter } from "@/lib/routers/user.router";
import { plansRouter } from "@/lib/routers/plans.router";
import { progressRouter } from "@/lib/routers/progress.router";
import { weightRouter } from "@/lib/routers/weight.router";
import { dietRouter } from "@/lib/routers/diet.router";
import { calorieRouter } from "@/lib/routers/calorie.router";

export const appRouter = router({
  user: userRouter,
  plans: plansRouter,
  progress: progressRouter,
  weight: weightRouter,
  diet: dietRouter,
  calorie: calorieRouter,
});

export type AppRouter = typeof appRouter;
