"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, HeartPulse, Sparkles, Activity } from "lucide-react";

const mealLabels: Record<string, string> = {
  breakfast: "Śniadanie",
  lunch: "Obiad",
  dinner: "Kolacja",
  snack: "Przekąska",
};

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-border bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const weights = trpc.weight.list.useQuery();
  const completedWorkouts = trpc.progress.getCompletedWorkouts.useQuery();
  const enrollments = trpc.progress.getEnrollments.useQuery();
  const plans = trpc.plans.list.useQuery({ category: "all" });
  const recipes = trpc.diet.list.useQuery({ mealType: "all", targetGoal: "all" });

  const summary = useMemo(() => {
    const entries = weights.data ?? [];
    const latest = entries[0];
    const previous = entries[1];
    const count = entries.length;
    const delta = latest && previous ? latest.weightKg - previous.weightKg : null;

    const recipeDistribution = (recipes.data ?? []).reduce<Record<string, number>>((acc, recipe) => {
      acc[recipe.mealType] = (acc[recipe.mealType] ?? 0) + 1;
      return acc;
    }, {});

    return {
      weightCount: count,
      weightDelta: delta,
      completedWorkouts: completedWorkouts.data?.length ?? 0,
      activePlans: enrollments.data?.filter((e) => !e.completedAt).length ?? 0,
      totalPlans: plans.data?.length ?? 0,
      totalRecipes: recipes.data?.length ?? 0,
      recipeDistribution,
    };
  }, [weights.data, completedWorkouts.data, enrollments.data, plans.data, recipes.data]);

  return (
    <main className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="heading text-4xl mb-1">Analizy</h1>
            <p className="text-muted-foreground text-sm">
              Szybki przegląd danych z aktualnych rekordów i postępów.
            </p>
          </div>
          <Badge variant="outline">Dane w czasie rzeczywistym</Badge>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <StatCard
            title="Pomiarów wagi"
            value={summary.weightCount.toString()}
            description="Ilość zapisanych wpisów wagowych"
            icon={<HeartPulse size={20} className="text-[var(--neon)]" />}
          />
          <StatCard
            title="Ukończonych treningów"
            value={summary.completedWorkouts.toString()}
            description="Łączna liczba zarejestrowanych ukończeń"
            icon={<Activity size={20} className="text-[var(--neon)]" />}
          />
          <StatCard
            title="Dostępnych przepisów"
            value={summary.totalRecipes.toString()}
            description="Przepisy gotowe do przeglądania"
            icon={<Sparkles size={20} className="text-[var(--neon)]" />}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">Trend wagi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4 text-sm">
                <span className="font-semibold">Zmiana od ostatniego pomiaru:</span>
                <span className={summary.weightDelta === null ? "text-muted-foreground" : summary.weightDelta < 0 ? "text-green-400" : "text-red-400"}>
                  {summary.weightDelta === null ? "Brak danych" : `${summary.weightDelta > 0 ? "+" : ""}${summary.weightDelta.toFixed(1)} kg`}
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(summary.recipeDistribution).map(([meal, count]) => (
                  <div key={meal} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{mealLabels[meal] ?? meal}</span>
                      <span>{count} przepisów</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                      <div
                        className="h-2 rounded-full bg-[var(--neon)]"
                        style={{ width: `${Math.round((count / Math.max(summary.totalRecipes, 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">Aktywny plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Liczba aktywnych planów oraz baza planów do wyboru.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">Aktywne</p>
                  <p className="text-2xl font-bold">{summary.activePlans}</p>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">Wszystkie plany</p>
                  <p className="text-2xl font-bold">{summary.totalPlans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
