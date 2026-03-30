"use client";

import { useStore } from "@nanostores/react";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc/client";
import { motion } from "motion/react";
import { Dumbbell, Weight, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function DashboardPage() {
  const authSession = useStore(useSession);
  const profile = trpc.user.getProfile.useQuery();
  const activePlan = trpc.progress.getActivePlan.useQuery();
  const weightEntries = trpc.weight.list.useQuery();
  const name = authSession?.data?.user?.name ?? "Gość";
  const latestWeight = weightEntries.data?.[0]?.weightKg ?? profile.data?.currentWeightKg;

  const goalLabel =
    profile.data?.goal === "gain_mass"
      ? "Budowanie masy"
      : profile.data?.goal === "lose_weight"
        ? "Redukcja wagi"
        : "–";

  const activePlanLabel = activePlan.data?.plan?.name ?? "Brak";
  const progressPct =
    activePlan.data && activePlan.data.totalCount > 0
      ? Math.round((activePlan.data.completedCount / activePlan.data.totalCount) * 100)
      : 0;

  return (
    <main className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading text-4xl mb-1">
          Witaj, <span className="neon">{name}</span>!
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {new Date().toLocaleDateString("pl-PL", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Dumbbell size={20} className="text-[var(--neon)]" />}
            label="Aktywny plan"
            value={activePlanLabel}
            delay={0}
          />
          <StatCard
            icon={<Weight size={20} className="text-[var(--neon)]" />}
            label="Aktualna waga"
            value={latestWeight ? `${latestWeight} kg` : "–"}
            delay={0.1}
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-[var(--neon)]" />}
            label="Cel treningowy"
            value={goalLabel}
            delay={0.2}
          />
        </div>

        {/* Active plan widget */}
        {activePlan.data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="mb-6"
          >
            <Link
              href={`/a/plans/${activePlan.data.plan.id}`}
              className="group block rounded-xl border border-border hover:border-[var(--neon)] transition-colors p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Aktywny plan</p>
                  <p className="heading text-xl neon">{activePlan.data.plan.name}</p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-muted-foreground group-hover:text-[var(--neon)] transition-colors"
                />
              </div>
              <Progress value={progressPct} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">
                {activePlan.data.completedCount} / {activePlan.data.totalCount} treningów ukończonych ({progressPct}%)
              </p>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <QuickLink
            href="/a/plans"
            label="Przeglądaj plany treningowe"
            sub="Znajdź plan dopasowany do Twoich celów"
            delay={0.3}
          />
          <QuickLink
            href="/a/weight"
            label="Zapisz wagę"
            sub="Śledź swój postęp na osi czasu"
            delay={0.4}
          />
          <QuickLink
            href="/a/diet"
            label="Odkryj przepisy"
            sub="Posiłki wspierające Twoje cele"
            delay={0.5}
          />
        </div>
      </motion.div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickLink({
  href,
  label,
  sub,
  delay,
}: {
  href: string;
  label: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        href={href}
        className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-[var(--neon)] hover:bg-secondary transition-all"
      >
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{sub}</p>
        </div>
        <ChevronRight
          size={20}
          className="text-muted-foreground group-hover:text-[var(--neon)] transition-colors"
        />
      </Link>
    </motion.div>
  );
}
