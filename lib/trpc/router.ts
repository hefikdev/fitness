import { router } from "@/lib/trpc/init";
import { userRouter } from "@/lib/routers/user.router";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
