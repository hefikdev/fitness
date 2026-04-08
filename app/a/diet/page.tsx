"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Flame, Beef, Target } from "lucide-react";
import Link from "next/link";

type MealType = "all" | "breakfast" | "lunch" | "dinner" | "snack";
type GoalFilter = "all" | "gain_mass" | "lose_weight";

const mealTabs: { value: MealType; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "breakfast", label: "Śniadanie" },
  { value: "lunch", label: "Obiad" },
  { value: "dinner", label: "Kolacja" },
  { value: "snack", label: "Przekąska" },
];

const mealLabels: Record<string, string> = {
  breakfast: "Śniadanie",
  lunch: "Obiad",
  dinner: "Kolacja",
  snack: "Przekąska",
};

const goalLabels: Record<string, string> = {
  gain_mass: "Masa",
  lose_weight: "Redukcja",
  both: "Uniwersalne",
};

const goalColors: Record<string, string> = {
  gain_mass: "text-blue-400",
  lose_weight: "text-green-400",
  both: "text-yellow-400",
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  targetGoal: string;
  prepMinutes: number;
};

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/a/diet/${recipe.id}`}
        className="group block rounded-3xl border border-border hover:border-[var(--neon)] transition-colors p-5 h-full"
      >
        <div className="flex items-start justify-between mb-3 gap-3">
          <h3 className="font-semibold text-base leading-snug group-hover:text-[var(--neon)] transition-colors">
            {recipe.name}
          </h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {mealLabels[recipe.mealType]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
          {recipe.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame size={12} className="text-orange-400" />
            {recipe.calories} kcal
          </span>
          <span className="flex items-center gap-1">
            <Beef size={12} className="text-red-400" />
            {recipe.protein}g białka
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {recipe.prepMinutes} min
          </span>
          <span className={`ml-auto text-xs font-medium ${goalColors[recipe.targetGoal]}`}>
            {goalLabels[recipe.targetGoal]}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function RecipeGrid({ mealType, goalFilter }: { mealType: MealType; goalFilter: GoalFilter }) {
  const { data, isPending } = trpc.diet.list.useQuery({
    mealType,
    targetGoal: goalFilter === "all" ? "all" : goalFilter,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <p className="text-center text-muted-foreground text-sm py-8">
        Brak przepisów w tej kategorii.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((recipe, i) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={i} />
      ))}
    </div>
  );
}

export default function DietPage() {
  const [mealType, setMealType] = useState<MealType>("all");
  const profile = trpc.user.getProfile.useQuery();
  const userGoal = profile.data?.goal as GoalFilter | undefined;
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("all");

  const goalFilterOptions: { value: GoalFilter; label: string }[] = [
    { value: "all", label: "Wszystkie" },
    { value: "gain_mass", label: "Budowanie masy" },
    { value: "lose_weight", label: "Redukcja wagi" },
  ];

  return (
    <main className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading text-4xl mb-1">Przepisy</h1>
            <p className="text-muted-foreground text-sm">
              Posiłki dopasowane do Twoich celów
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {goalFilterOptions.map((opt) => {
              const isMyGoal = opt.value !== "all" && opt.value === userGoal;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGoalFilter(opt.value)}
                  className={
                    "rounded-full border px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap " +
                    (goalFilter === opt.value
                      ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]"
                      : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground")
                  }
                  aria-pressed={goalFilter === opt.value}
                >
                  {opt.label}
                  {isMyGoal && <span className="ml-2 opacity-70">★</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="inline-flex flex-wrap gap-2">
            {mealTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMealType(tab.value)}
                className={
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap " +
                  (mealType === tab.value
                    ? "border-[var(--neon)] bg-[var(--neon)]/10 text-[var(--neon)]"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground")
                }
                aria-pressed={mealType === tab.value}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <RecipeGrid mealType={mealType} goalFilter={goalFilter} />
        </div>
      </motion.div>
    </main>
  );
}
