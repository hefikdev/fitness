import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const verifySession = cache(async () => {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) {
    redirect("/login");
  }

  return session;
});

export const verifyOnboarding = cache(async () => {
  const session = await verifySession();

  const profile = await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, session.user.id),
  });

  if (!profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  return { session, profile };
});
