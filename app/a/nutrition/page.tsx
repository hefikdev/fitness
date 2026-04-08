"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

const nutritionCards = [
  { title: "Makroskładniki", description: "Jak zbilansować białka, tłuszcze i węglowodany w codziennym jadłospisie." },
  { title: "Przekąski do pracy", description: "Szybkie przekąski, które można zabrać ze sobą i które nie obciążają diety." },
  { title: "Nawodnienie", description: "Dlaczego woda i odpowiednie płyny są kluczowe dla wydajności i regeneracji." },
  { title: "Plan posiłków", description: "Prosty system planowania posiłków na cały tydzień, bez skomplikowanych zakupów." },
];

export default function NutritionPage() {
  return (
    <main className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading text-4xl mb-1">Odżywianie</h1>
            <p className="text-muted-foreground text-sm">Łatwe do wdrożenia wskazówki żywieniowe dla diety i regeneracji.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {nutritionCards.map((item) => (
            <Card key={item.title} className="rounded-3xl border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Plan tygodnia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ustal ramowy plan: śniadanie z białkiem, na obiad pełnowartościowy posiłek, a wieczorem lekka kolacja z dużą ilością warzyw.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Zadbaj o białko w każdym posiłku</li>
                <li>• Wybieraj pełnowartościowe węglowodany</li>
                <li>• Pij wodę i unikaj przetworzonej żywności</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Leaf size={16} />
            <span>W przyszłości ta strona może zostać rozbudowana o dane z diet router i personalizowane plany posiłków.</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
