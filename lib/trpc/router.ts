import { router } from "@/lib/trpc/init";

// Sub-routers will be added here in subsequent commits
export const appRouter = router({});

export type AppRouter = typeof appRouter;
