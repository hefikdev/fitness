"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

type Category = "all" | "strength" | "cardio" | "hiit" | "flexibility";

const categories: { label: string; value: Category }[] = [
  { label: "Wszystkie", value: "all" },
  { label: "Siła", value: "strength" },
  { label: "Kardio", value: "cardio" },
  { label: "HIIT", value: "hiit" },
  { label: "Elastyczność", value: "flexibility" },
];

const categoryGradients: Record<string, string> = {
  strength: "from-green-500/20 to-transparent",
  cardio: "from-blue-500/20 to-transparent",
  hiit: "from-red-500/20 to-transparent",
  flexibility: "from-purple-500/20 to-transparent",
};

const categoryLabels: Record<string, string> = {
  strength: "Siła",
  cardio: "Kardio",
  hiit: "HIIT",
  flexibility: "Elastyczność",
};

const difficultyLabels: Record<string, string> = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
};

const difficultyClasses: Record<string, string> = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

type Plan = {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  durationWeeks: number;
  targetGoal: string;
  imageSlug: string;
};

type Enrollment = {
  planId: string;
  completedAt: Date | string | null;
};

function PlanCard({
  plan,
  index,
  enrollment,
  progressPct,
}: {
  plan: Plan;
  index: number;
  enrollment?: Enrollment;
  progressPct?: number;
}) {
  const isCompleted = !!enrollment?.completedAt;
  const isActive = !!enrollment && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link href={`/a/plans/${plan.id}`} className="block h-full group">
        <div
          className={[
            "h-full rounded-3xl border overflow-hidden transition-colors duration-200",
            isCompleted
              ? "border-[var(--neon)]/40 hover:border-[var(--neon)]"
              : isActive
                ? "border-[var(--neon)]/60 hover:border-[var(--neon)]"
                : "border-border hover:border-[var(--neon)]",
          ].join(" ")}
        >
          <div
            className={`relative h-28 bg-gradient-to-br ${categoryGradients[plan.category] ?? "from-secondary"} bg-secondary flex items-end p-4`}
          >
            <span className="heading text-2xl neon line-clamp-1">{plan.name}</span>
            {isCompleted && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium text-[var(--neon)] bg-[var(--neon)]/10 border border-[var(--neon)]/30 rounded-full px-2 py-0.5">
                <CheckCircle2 size={10} />
                Ukończony
              </span>
            )}
            {isActive && (
              <span className="absolute top-3 right-3 text-[10px] font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-2 py-0.5">
                W trakcie
              </span>
            )}
          </div>
          <div className="p-5 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            {isActive && typeof progressPct === "number" && (
              <div>
                <Progress value={progressPct} className="h-1.5 mb-0.5" />
                <p className="text-[10px] text-muted-foreground">{progressPct}% ukończono</p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-auto">
              <Badge variant="outline">{categoryLabels[plan.category]}</Badge>
              <span className={`text-xs font-medium ${difficultyClasses[plan.difficulty]}`}>
                {difficultyLabels[plan.difficulty]}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock size={12} />
                {plan.durationWeeks} tyg.
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PlanGrid({ category }: { category: Category }) {
  const { data: plans, isPending: plansLoading } = trpc.plans.list.useQuery({ category });
  const { data: enrollments } = trpc.progress.getEnrollments.useQuery();
  const activePlan = trpc.progress.getActivePlan.useQuery();

  if (plansLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!plans?.length) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        Brak planów w tej kategorii.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan, i) => {
        const enrollment = enrollments?.find((e) => e.planId === plan.id);
        const progressPct =
          activePlan.data?.plan.id === plan.id && activePlan.data.totalCount > 0
            ? Math.round((activePlan.data.completedCount / activePlan.data.totalCount) * 100)
            : undefined;
        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={i}
            enrollment={enrollment}
            progressPct={progressPct}
          />
        );
      })}
    </div>
  );
}

export default function PlansPage() {
  const [category, setCategory] = useState<Category>("all");

  return (
    <main className="p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="heading text-4xl mb-1">Plany Treningowe</h1>
          <p className="text-muted-foreground text-sm">
            Wybierz plan dopasowany do swoich celów
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-2 rounded-3xl border border-border bg-background/95 p-2 shadow-sm"
          aria-label="Kategorie planów"
        >
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[var(--neon)] " +
                (category === c.value
                  ? "bg-[var(--neon)]/10 text-[var(--neon)] border border-[var(--neon)]"
                  : "bg-transparent text-muted-foreground border border-transparent hover:text-foreground hover:border-border")
              }
              aria-pressed={category === c.value}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        <PlanGrid category={category} />
      </div>
    </main>
  );
}
