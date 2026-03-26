"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
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

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link href={`/a/plans/${plan.id}`} className="block h-full group">
        <div className="h-full rounded-xl border border-border overflow-hidden hover:border-[var(--neon)] transition-colors">
          <div
            className={`h-28 bg-gradient-to-br ${categoryGradients[plan.category] ?? "from-secondary"} bg-secondary flex items-end p-4`}
          >
            <span className="heading text-2xl neon line-clamp-1">{plan.name}</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            <div className="flex items-center gap-2 flex-wrap mt-auto">
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
  const { data: plans, isPending } = trpc.plans.list.useQuery({ category });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
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
      {plans.map((plan, i) => (
        <PlanCard key={plan.id} plan={plan} index={i} />
      ))}
    </div>
  );
}

export default function PlansPage() {
  const [category, setCategory] = useState<Category>("all");

  return (
    <main className="p-6 md:p-8">
      <h1 className="heading text-4xl mb-1">Plany Treningowe</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Wybierz plan dopasowany do swoich celów
      </p>

      <Tabs
        value={category}
        onValueChange={(v: string) => setCategory(v as Category)}
        className="w-full"
      >
        <TabsList className="mb-6 h-auto flex-wrap gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((c) => (
          <TabsContent key={c.value} value={c.value}>
            <PlanGrid category={c.value} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
