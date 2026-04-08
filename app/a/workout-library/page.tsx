"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Dumbbell, Clock, ArrowRight, HeartPulse } from "lucide-react";

const workouts = [
  { title: "Trening siłowy 4x", description: "Pełny plan na masę mięśniową z priorytetem na technikę.", badge: "Siła" },
  { title: "Kardio interwałowe", description: "HIIT, który poprawia kondycję i spala tłuszcz.", badge: "Kondycja" },
  { title: "Mobilność i stretching", description: "Delikatny plan na lepszą ruchomość i regenerację.", badge: "Regeneracja" },
  { title: "Trening wydolnościowy", description: "Dłuższa sesja, która poprawia wytrzymałość i oddech.", badge: "Wytrzymałość" },
  { title: "Full body w domu", description: "Pełny trening całego ciała bez sprzętu, idealny do szybkiej sesji.", badge: "Dom" },
  { title: "Regeneracja aktywna", description: "Lekkie ćwiczenia po treningu, które wspierają mobilność i przepływ krwi.", badge: "Regeneracja" },
];

export default function WorkoutLibraryPage() {
  return (
    <main className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading text-4xl mb-1">Biblioteka treningów</h1>
            <p className="text-muted-foreground text-sm">Zbiór przykładowych planów i koncepcji treningowych.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {workouts.map((item) => (
            <Card key={item.title} className="rounded-3xl border-border">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{item.badge}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Dumbbell size={14} />
                  <span>Poziom: średniozaawansowany</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>Szacowany czas: 35-45 min</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-secondary/40 p-5">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Sparkles size={16} />
              <span>Znajdź swoje ulubione style treningu: siłowy, kardio, mobilność lub regenerację.</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRight size={16} />
              <span>Możesz łatwo rozbudować bibliotekę o nowe warianty, dzieląc je na poziomy i porę dnia.</span>
            </div>
            <div className="flex items-center gap-3">
              <HeartPulse size={16} />
              <span>Dodaj krótkie wyjaśnienie, dlaczego dany trening jest dobry do obecnego celu użytkownika.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
