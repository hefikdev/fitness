"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Flame } from "lucide-react";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export default function CaloriesPage() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [calories, setCalories] = useState("");
  const [label, setLabel] = useState("");

  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.calorie.listByDate.useQuery({ date: selectedDate });
  const { data: recent } = trpc.calorie.listRecent.useQuery();

  const addMutation = trpc.calorie.add.useMutation({
    onSuccess: () => {
      utils.calorie.listByDate.invalidate();
      utils.calorie.listRecent.invalidate();
      setCalories("");
      setLabel("");
    },
  });

  const deleteMutation = trpc.calorie.delete.useMutation({
    onSuccess: () => {
      utils.calorie.listByDate.invalidate();
      utils.calorie.listRecent.invalidate();
    },
  });

  const dailyTotal = entries?.reduce((sum, e) => sum + e.calories, 0) ?? 0;

  // Build last-7-days summary from recent entries
  const last7Days: { date: string; total: number }[] = (() => {
    if (!recent) return [];
    const map: Record<string, number> = {};
    recent.forEach((e) => {
      map[e.date] = (map[e.date] ?? 0) + e.calories;
    });
    const days: { date: string; total: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push({ date: key, total: map[key] ?? 0 });
    }
    return days;
  })();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const cal = parseInt(calories, 10);
    if (!cal || cal < 1) return;
    addMutation.mutate({ date: selectedDate, calories: cal, label: label || undefined });
  }

  return (
    <main className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
      <div>
        <h1 className="heading text-3xl neon">Kalorie</h1>
        <p className="text-muted-foreground text-sm mt-1">Śledź dzienne spożycie kalorii</p>
      </div>

      {/* Date picker + daily total */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label htmlFor="cal-date" className="text-sm shrink-0">Dzień:</Label>
          <Input
            id="cal-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-44"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Flame size={18} className="text-[var(--neon)]" />
          <span className="text-2xl font-bold">{dailyTotal}</span>
          <span className="text-muted-foreground text-sm">kcal łącznie</span>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="rounded-xl border border-border p-4 space-y-3">
        <p className="text-sm font-medium">Dodaj wpis</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="cal-label" className="text-xs text-muted-foreground">Opis (opcjonalnie)</Label>
            <Input
              id="cal-label"
              placeholder="np. Śniadanie, Obiad…"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="w-28">
            <Label htmlFor="cal-kcal" className="text-xs text-muted-foreground">Kalorie (kcal)</Label>
            <Input
              id="cal-kcal"
              type="number"
              placeholder="500"
              min={1}
              max={10000}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          size="sm"
          className="bg-[var(--neon)] text-black hover:bg-[var(--neon)]/80 w-full"
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? "Dodaję…" : "+ Dodaj"}
        </Button>
      </form>

      {/* Entries for selected day */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {selectedDate === todayStr() ? "Dzisiaj" : formatDate(selectedDate)}
        </p>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : entries && entries.length > 0 ? (
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.label ?? "Wpis"}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeof entry.createdAt === "string"
                      ? entry.createdAt.slice(11, 16)
                      : new Date(entry.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className="font-bold text-[var(--neon)] shrink-0">{entry.calories} kcal</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => deleteMutation.mutate({ id: entry.id })}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={15} />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Brak wpisów na ten dzień.
          </p>
        )}
      </div>

      {/* Last 7 days mini summary */}
      <div className="rounded-xl border border-border p-4 space-y-2">
        <p className="text-sm font-medium">Ostatnie 7 dni</p>
        {last7Days.map(({ date, total }) => (
          <div key={date} className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-24 shrink-0">{formatDate(date)}</span>
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-[var(--neon)] transition-all"
                style={{ width: `${Math.min(100, (total / 3000) * 100)}%` }}
              />
            </div>
            <span className="w-20 text-right shrink-0">{total > 0 ? `${total} kcal` : "—"}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </main>
  );
}
