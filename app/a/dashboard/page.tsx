"use client";

import { useStore } from "@nanostores/react";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const authSession = useStore(useSession);
  const profile = trpc.user.getProfile.useQuery();

  const name = authSession?.data?.user?.name ?? "Gość";

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="heading text-4xl neon mb-2">FitForge</h1>
      <p className="text-muted-foreground">
        Witaj, <span className="text-foreground font-medium">{name}</span>!
      </p>
    </main>
  );
}
