"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CalendarCheck, Clock, Moon } from "lucide-react";

const tips = [
  { title: "Rutyna poranna", description: "Zacznij dzień od prostego rozgrzewki i stałego śniadania." },
  { title: "Dobry sen", description: "Regularne godziny snu wspierają regenerację i spalanie tłuszczu." },
  { title: "Nawadnianie", description: "Pilnuj 2-3 litrów płynów dziennie, szczególnie przy treningach." },
  { title: "Dni odpoczynku", description: "Daj mięśniom czas na odbudowę, planując 1-2 dni regeneracji tygodniowo." },
];

export default function TipsPage() {
  return (
    <main className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading text-4xl mb-1">Porady</h1>
            <p className="text-muted-foreground text-sm">Szybkie wskazówki do lepszego treningu i regeneracji.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {tips.map((tip) => (
            <Card key={tip.title} className="rounded-3xl border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <CalendarCheck size={14} />
                  <span>Utrzymuj regularność</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-secondary/40 p-5">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Moon size={16} />
              <span>Więcej porad może pojawić się po analizie zachowań użytkownika i wyników w aplikacji.</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} />
              <span>Warto zaplanować regenerację w kalendarzu i monitorować jakość snu.</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles size={16} />
              <span>Krótka rutyna na dzień spokojnie poprawia efekty treningowe.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
