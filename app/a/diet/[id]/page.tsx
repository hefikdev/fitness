"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Flame, Beef, Wheat, Droplets } from "lucide-react";
import Link from "next/link";

const goalLabels: Record<string, string> = {
  gain_mass: "Budowanie masy",
  lose_weight: "Redukcja wagi",
  both: "Uniwersalne",
};

const mealLabels: Record<string, string> = {
  breakfast: "Śniadanie",
  lunch: "Obiad",
  dinner: "Kolacja",
  snack: "Przekąska",
};

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isPending } = trpc.diet.getById.useQuery({ id });

  if (isPending) {
    return (
      <main className="p-6 md:p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-24 mb-6" />
        <Skeleton className="h-48" />
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="p-6 md:p-8">
        <p className="text-muted-foreground">Przepis nie istnieje.</p>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/a/diet"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Powrót do przepisów
        </Link>

        <div className="flex items-start gap-3 mb-2 flex-wrap">
          <Badge variant="outline">{mealLabels[recipe.mealType]}</Badge>
          <Badge variant="outline">{goalLabels[recipe.targetGoal]}</Badge>
        </div>

        <h1 className="heading text-4xl mb-3">{recipe.name}</h1>
        <p className="text-muted-foreground mb-6">{recipe.description}</p>

        {/* Macros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Flame size={16} className="text-orange-400" />, label: "Kalorie", value: `${recipe.calories} kcal` },
            { icon: <Beef size={16} className="text-red-400" />, label: "Białko", value: `${recipe.protein}g` },
            { icon: <Wheat size={16} className="text-yellow-400" />, label: "Węglowodany", value: `${recipe.carbs}g` },
            { icon: <Droplets size={16} className="text-blue-400" />, label: "Tłuszcze", value: `${recipe.fat}g` },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-border p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {m.icon}
                {m.label}
              </div>
              <p className="font-semibold text-sm">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Clock size={14} />
          Czas przygotowania: <span className="text-foreground font-medium">{recipe.prepMinutes} min</span>
        </div>

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-3">Składniki</h2>
          <ul className="flex flex-col gap-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section>
          <h2 className="font-semibold text-lg mb-3">Przygotowanie</h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="heading text-xl neon shrink-0 w-6">{i + 1}.</span>
                <p className="text-sm pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </motion.div>
    </main>
  );
}
