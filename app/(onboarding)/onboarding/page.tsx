"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc/client";

type Goal = "gain_mass" | "lose_weight";
type Gender = "male" | "female" | "other";

const weightSchema = z.number({ message: "Wprowadź wagę" }).min(20).max(500);
const ageSchema = z.number({ message: "Wprowadź wiek" }).int().min(10).max(120);

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | undefined>();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | undefined>();

  const saveOnboarding = trpc.user.saveOnboarding.useMutation({
    onSuccess: () => router.push("/a/dashboard"),
    onError: () => setError("Coś poszło nie tak. Spróbuj ponownie."),
  });

  function nextStep() {
    setError(undefined);
    if (step === 1) {
      const ageNum = Number(age);
      const ageResult = ageSchema.safeParse(ageNum);
      if (!ageResult.success) { setError("Podaj prawidłowy wiek (10–120)."); return; }
    }
    if (step === 2) {
      const weightNum = Number(weight);
      const weightResult = weightSchema.safeParse(weightNum);
      if (!weightResult.success) { setError("Podaj prawidłową wagę (20–500 kg)."); return; }
    }
    setStep((s) => s + 1);
  }

  function handleFinish() {
    if (!goal) return;
    saveOnboarding.mutate({
      goal,
      age: Number(age),
      gender,
      currentWeightKg: Number(weight),
    });
  }

  const steps = [
    <div key="goal" className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">Na czym Ci zależy?</p>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { value: "lose_weight", label: "Odchudzanie", icon: "🔥" },
            { value: "gain_mass", label: "Przybranie na masie", icon: "💪" },
          ] as { value: Goal; label: string; icon: string }[]
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { setGoal(opt.value); setStep(1); }}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 text-sm font-medium transition-all hover:border-neon hover:text-neon ${
              goal === opt.value ? "border-neon text-neon neon-border" : "border-border"
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>,
    <div key="details" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="age">Wiek</Label>
        <Input
          id="age"
          type="number"
          min={10}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="25"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Płeć</Label>
        <RadioGroup value={gender} onValueChange={(v) => setGender(v as Gender)} className="flex gap-4">
          {(
            [
              { value: "male", label: "Mężczyzna" },
              { value: "female", label: "Kobieta" },
              { value: "other", label: "Inna" },
            ] as { value: Gender; label: string }[]
          ).map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <Label htmlFor={opt.value} className="font-normal cursor-pointer">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>,

    <div key="weight" className="flex flex-col gap-1.5">
      <Label htmlFor="weight">Obecna waga (kg)</Label>
      <Input
        id="weight"
        type="number"
        min={20}
        max={500}
        step={0.1}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="75"
      />
    </div>,

    <div key="summary" className="flex flex-col gap-3 text-sm">
      <div className="rounded-lg border border-border p-4 flex flex-col gap-2">
        <p><span className="text-muted-foreground">Cel: </span><span className="font-medium">{goal === "lose_weight" ? "Odchudzanie" : "Przybranie na masie"}</span></p>
        <p><span className="text-muted-foreground">Wiek: </span><span className="font-medium">{age} lat</span></p>
        <p><span className="text-muted-foreground">Płeć: </span><span className="font-medium">{{ male: "Mężczyzna", female: "Kobieta", other: "Inna" }[gender]}</span></p>
        <p><span className="text-muted-foreground">Waga: </span><span className="font-medium">{weight} kg</span></p>
      </div>
    </div>,
  ];

  const titles = ["Twój cel", "Twoje dane", "Twoja waga", "Podsumowanie"];
  const descriptions = [
    "Wybierz swój główny cel treningowy",
    "Podaj swój wiek i płeć",
    "Jaka jest Twoja obecna waga?",
    "Wszystko się zgadza?",
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "bg-neon w-8" : "bg-border w-4"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="heading text-2xl">{titles[step]}</CardTitle>
            <CardDescription>{descriptions[step]}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3 mt-2">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => { setError(undefined); setStep((s) => s - 1); }}
                  className="flex-1"
                >
                  Wstecz
                </Button>
              )}
              {step < steps.length - 1 && step > 0 && (
                <Button onClick={nextStep} className="flex-1">
                  Dalej
                </Button>
              )}
              {step === steps.length - 1 && (
                <Button
                  onClick={handleFinish}
                  disabled={saveOnboarding.isPending}
                  className="flex-1 bg-neon text-black hover:bg-neon/80 font-bold"
                >
                  {saveOnboarding.isPending ? "Zapisywanie..." : "Zaczynamy!"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
