"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, TrendingDown, TrendingUp, Minus } from "lucide-react";

type WeightEntry = { id: string; weightKg: number; recordedAt: Date | string; notes: string | null };

function WeightChart({ entries }: { entries: WeightEntry[] }) {
  if (entries.length < 2) return null;

  // entries are newest-first, reverse for chart
  const sorted = [...entries].reverse();
  const weights = sorted.map((e) => e.weightKg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const W = 600;
  const H = 120;
  const PAD = { top: 16, right: 24, bottom: 24, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xOf = (i: number) => PAD.left + (i / (sorted.length - 1)) * chartW;
  const yOf = (w: number) => PAD.top + chartH - ((w - minW) / range) * chartH;

  const linePath = sorted
    .map((e, i) => `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${yOf(e.weightKg).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${xOf(sorted.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)}` +
    ` L ${xOf(0).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

  // Y axis labels
  const yLabels = [minW, minW + range / 2, maxW].map((v) => ({
    val: v.toFixed(1),
    y: yOf(v),
  }));

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4 mb-8">
      <p className="text-xs text-muted-foreground mb-3">Wykres wagi</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39ff14" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yLabels.map((l) => (
          <g key={l.val}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={l.y}
              y2={l.y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={l.y + 4}
              textAnchor="end"
              fontSize="10"
              fill="currentColor"
              opacity="0.5"
            >
              {l.val}
            </text>
          </g>
        ))}
        {/* Area fill */}
        <path d={areaPath} fill="url(#wg)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {sorted.map((e, i) => (
          <circle key={i} cx={xOf(i)} cy={yOf(e.weightKg)} r="3.5" fill="#39ff14" />
        ))}
        {/* X axis first/last label */}
        {[0, sorted.length - 1].map((i) => (
          <text
            key={i}
            x={xOf(i)}
            y={H - 4}
            textAnchor={i === 0 ? "start" : "end"}
            fontSize="10"
            fill="currentColor"
            opacity="0.5"
          >
            {new Date(sorted[i].recordedAt).toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
          </text>
        ))}
      </svg>
    </div>
  );
}

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
  const [confirmId, setConfirmId] = useState<string | null>(null);

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

        {/* Chart */}
        {entries && entries.length >= 2 && <WeightChart entries={entries} />}

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
                      onClick={() => setConfirmId(entry.id)}
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

      <Dialog open={!!confirmId} onOpenChange={(open) => { if (!open) setConfirmId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń pomiar</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć ten pomiar? Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Anuluj
            </Button>
            <Button
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => {
                if (confirmId) {
                  remove.mutate({ id: confirmId });
                  setConfirmId(null);
                }
              }}
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
