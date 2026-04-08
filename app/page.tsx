import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) redirect("/login");

  const profile = await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, session.user.id),
  });

  if (!profile?.onboardingCompleted) redirect("/onboarding");

  redirect("/a/dashboard");
}
