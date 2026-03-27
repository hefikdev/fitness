"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, TrendingDown, TrendingUp, Minus } from "lucide-react";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function WeightPage() {
  const [kg, setKg] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const { data: entries, isPending } = trpc.weight.list.useQuery();

  const add = trpc.weight.add.useMutation({
    onSuccess: () => {
      setKg("");
      setNotes("");
      setError("");
      utils.weight.list.invalidate();
    },
    onError: () => setError("Coś poszło nie tak."),
  });

  const remove = trpc.weight.delete.useMutation({
    onSuccess: () => utils.weight.list.invalidate(),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(kg);
    if (isNaN(val) || val < 20 || val > 500) {
      setError("Podaj wagę między 20 a 500 kg.");
      return;
    }
    add.mutate({ weightKg: val, notes: notes || undefined });
  }

  const latest = entries?.[0];
  const previous = entries?.[1];
  const diff =
    latest && previous
      ? parseFloat((latest.weightKg - previous.weightKg).toFixed(1))
      : null;

  return (
    <main className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading text-4xl mb-1">Waga Ciała</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Śledź swój postęp na osi czasu
        </p>

        {/* Summary */}
        {latest && (
          <div className="flex items-center gap-6 mb-8 p-4 rounded-xl border border-border bg-secondary/40">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Aktualna waga</p>
              <p className="heading text-3xl neon">{latest.weightKg} kg</p>
            </div>
            {diff !== null && (
              <div className="flex items-center gap-1.5">
                {diff < 0 ? (
                  <TrendingDown size={18} className="text-green-400" />
                ) : diff > 0 ? (
                  <TrendingUp size={18} className="text-red-400" />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )}
                <span
                  className={`text-sm font-medium ${
                    diff < 0
                      ? "text-green-400"
                      : diff > 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff} kg vs poprzedni wpis
                </span>
              </div>
            )}
          </div>
        )}

        {/* Add form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border p-5 mb-8 flex flex-col gap-4"
        >
          <h2 className="font-semibold text-base">Dodaj pomiar</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="weight-kg" className="mb-1 block text-sm">
                Waga (kg)
              </Label>
              <Input
                id="weight-kg"
                type="number"
                step="0.1"
                min="20"
                max="500"
                placeholder="np. 75.5"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="weight-notes" className="mb-1 block text-sm">
                Notatka (opcjonalnie)
              </Label>
              <Input
                id="weight-notes"
                placeholder="np. rano, po treningu"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={add.isPending} className="self-start">
            {add.isPending ? "Zapisywanie…" : "Zapisz wagę"}
          </Button>
        </form>

        {/* History */}
        <h2 className="font-semibold text-base mb-3">Historia pomiarów</h2>
        {isPending ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : !entries?.length ? (
          <p className="text-muted-foreground text-sm py-6 text-center">
            Brak pomiarów. Dodaj pierwszy!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:border-border/80 bg-secondary/20"
                >
                  <div>
                    <span className="font-semibold text-base">
                      {entry.weightKg} kg
                    </span>
                    {entry.notes && (
                      <span className="text-muted-foreground text-xs ml-2">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.recordedAt)}
                    </span>
                    <button
                      onClick={() => remove.mutate({ id: entry.id })}
                      disabled={remove.isPending}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </main>
  );
}
