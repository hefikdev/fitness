"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

type Goal = "gain_mass" | "lose_weight";
type Gender = "male" | "female" | "other";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const activityOptions: Array<{ value: ActivityLevel; label: string }> = [
  { value: "sedentary", label: "Niska aktywność (praca siedząca)" },
  { value: "light", label: "Lekka aktywność (trening 1-2 razy/tydzień)" },
  { value: "moderate", label: "Umiarkowana aktywność (3-4 razy/tydzień)" },
  { value: "active", label: "Wysoka aktywność (5-6 razy/tydzień)" },
  { value: "very_active", label: "Bardzo wysoka aktywność (codzienny trening)" },
];

const goalOptions: Array<{ value: Goal; label: string }> = [
  { value: "lose_weight", label: "Odchudzanie" },
  { value: "gain_mass", label: "Budowanie masy" },
];

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "male", label: "Mężczyzna" },
  { value: "female", label: "Kobieta" },
  { value: "other", label: "Inna" },
];

function round(value: number, digits = 0) {
  return Number(value.toFixed(digits));
}

function getActivityFactor(level: ActivityLevel) {
  switch (level) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "active":
      return 1.725;
    case "very_active":
      return 1.9;
    default:
      return 1.55;
  }
}

function calculateBmr(weight: number, height: number, age: number, gender: Gender) {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  if (gender === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 10 * weight + 6.25 * height - 5 * age;
}

export default function CalculatorPage() {
  const profileQuery = trpc.user.getProfile.useQuery();
  const [goal, setGoal] = useState<Goal>("lose_weight");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  useEffect(() => {
    if (profileQuery.data) {
      setGoal(profileQuery.data.goal);
      setGender(profileQuery.data.gender);
      setAge(String(profileQuery.data.age));
      setWeight(String(profileQuery.data.currentWeightKg));
    }
  }, [profileQuery.data]);

  const parsedAge = Number(age);
  const parsedHeight = Number(height);
  const parsedWeight = Number(weight);
  const hasValidInputs = parsedAge >= 10 && parsedAge <= 120 && parsedHeight > 0 && parsedWeight >= 20 && parsedWeight <= 500;

  const results = useMemo(() => {
    if (!hasValidInputs) {
      return null;
    }

    const bmi = parsedWeight / ((parsedHeight / 100) ** 2);
    const bmr = calculateBmr(parsedWeight, parsedHeight, parsedAge, gender);
    const tdee = bmr * getActivityFactor(activity);
    const targetCalories = goal === "lose_weight" ? Math.max(1200, tdee - 500) : tdee + 300;

    const proteinRatio = goal === "gain_mass" ? 0.3 : 0.35;
    const carbsRatio = goal === "gain_mass" ? 0.45 : 0.35;
    const fatRatio = 1 - proteinRatio - carbsRatio;

    return {
      bmi: round(bmi, 1),
      bmr: round(bmr, 0),
      tdee: round(tdee, 0),
      targetCalories: round(targetCalories, 0),
      macros: {
        protein: round((targetCalories * proteinRatio) / 4, 0),
        carbs: round((targetCalories * carbsRatio) / 4, 0),
        fat: round((targetCalories * fatRatio) / 9, 0),
      },
    };
  }, [activity, gender, goal, hasValidInputs, parsedAge, parsedHeight, parsedWeight]);

  return (
    <main className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h1 className="heading text-4xl mb-1">Kalkulator Fitness</h1>
            <p className="text-muted-foreground text-sm">
              Oblicz BMI, BMR i dzienne zapotrzebowanie kaloryczne dla odchudzania lub budowy masy.
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Wzór Mifflin-St Jeor
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-lg">Dane użytkownika</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="calc-goal" className="mb-2 block text-sm font-medium">
                    Cel
                  </Label>
                  <select
                    id="calc-goal"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value as Goal)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/50"
                  >
                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="calc-gender" className="mb-2 block text-sm font-medium">
                    Płeć
                  </Label>
                  <select
                    id="calc-gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value as Gender)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/50"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="calc-age" className="mb-2 block text-sm font-medium">
                    Wiek
                  </Label>
                  <Input
                    id="calc-age"
                    type="number"
                    min={10}
                    max={120}
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="calc-height" className="mb-2 block text-sm font-medium">
                    Wzrost (cm)
                  </Label>
                  <Input
                    id="calc-height"
                    type="number"
                    min={100}
                    max={250}
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    placeholder="175"
                  />
                </div>
                <div>
                  <Label htmlFor="calc-weight" className="mb-2 block text-sm font-medium">
                    Waga (kg)
                  </Label>
                  <Input
                    id="calc-weight"
                    type="number"
                    min={20}
                    max={500}
                    step="0.1"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="75.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="calc-activity" className="mb-2 block text-sm font-medium">
                  Poziom aktywności
                </Label>
                <select
                  id="calc-activity"
                  value={activity}
                  onChange={(event) => setActivity(event.target.value as ActivityLevel)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/50"
                >
                  {activityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-secondary/50">
            <CardHeader>
              <CardTitle className="text-lg">Szybki przegląd</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Wprowadź dane, aby zobaczyć swoje oszacowanie zapotrzebowania kalorycznego i makroskładników.</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground mb-2">BMI</p>
                  <p className="text-3xl font-bold">{results ? results.bmi : "–"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground mb-2">Dzienne TDEE</p>
                  <p className="text-3xl font-bold">{results ? `${results.tdee} kcal` : "–"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground mb-2">Cel kaloryczny</p>
                  <p className="text-3xl font-bold">{results ? `${results.targetCalories} kcal` : "–"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-base">BMI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Wskaźnik masy ciała pomaga ocenić, czy jesteś w zakresie prawidłowej wagi.
              </p>
              <p className="text-lg font-semibold">Interpretacja:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• poniżej 18.5 – niedowaga</li>
                <li>• 18.5–24.9 – prawidłowa waga</li>
                <li>• 25.0–29.9 – nadwaga</li>
                <li>• powyżej 30 – otyłość</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-base">Makroskładniki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Przybliżone gramatura dziennych makroskładników.</p>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Białko</span>
                      <span className="font-semibold">{results.macros.protein} g</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Węglowodany</span>
                      <span className="font-semibold">{results.macros.carbs} g</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tłuszcze</span>
                      <span className="font-semibold">{results.macros.fat} g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Uzupełnij wszystkie dane wejściowe, aby zobaczyć rekomendacje makroskładników.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="text-base">Podsumowanie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Zalecane tempo zmiany wagi zależy od Twojego celu i zapotrzebowania kalorycznego.</p>
              <div className="rounded-2xl bg-background/80 p-4">
                <p className="text-sm font-semibold">{goal === "lose_weight" ? "Utrata masy" : "Przyrost masy"}</p>
                <p className="text-sm text-muted-foreground">{goal === "lose_weight" ? "Redukcja: około -500 kcal od TDEE" : "Masa: około +300 kcal do TDEE"}</p>
              </div>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full">
                Przeskocz do formularza
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-secondary/50 p-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calculator size={18} />
            <span>
              Ten kalkulator działa w pełni po stronie klienta i jest wzorowany na standardowych metodach fitness.
            </span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
