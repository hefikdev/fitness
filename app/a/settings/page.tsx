"use client";

import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

type Goal = "gain_mass" | "lose_weight";
type Gender = "male" | "female" | "other";

const goalOptions = [
  { value: "gain_mass", label: "Budowanie masy" },
  { value: "lose_weight", label: "Redukcja wagi" },
];

const genderOptions = [
  { value: "male", label: "Mężczyzna" },
  { value: "female", label: "Kobieta" },
  { value: "other", label: "Inne" },
];

export default function SettingsPage() {
  const router = useRouter();
  const authSession = useStore(useSession);
  const utils = trpc.useUtils();
  const { data: profile, isPending } = trpc.user.getProfile.useQuery();

  const [goal, setGoal] = useState<Goal | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setGoal(profile.goal);
      setGender(profile.gender);
      setAge(String(profile.age));
      setWeight(String(profile.currentWeightKg));
    }
  }, [profile]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      setSaved(true);
      utils.user.getProfile.invalidate();
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => setError("Nie udało się zapisać zmian."),
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      setError("Podaj prawidłowy wiek (10–120).");
      return;
    }
    if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      setError("Podaj prawidłową wagę (20–500 kg).");
      return;
    }
    updateProfile.mutate({
      goal: goal as Goal,
      gender: gender as Gender,
      age: ageNum,
      currentWeightKg: weightNum,
    });
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <main className="p-6 md:p-8 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="heading text-4xl mb-1">Ustawienia</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Zarządzaj swoim profilem i preferencjami
        </p>

        {/* Account info */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Konto
          </h2>
          <div className="rounded-xl border border-border p-4 flex flex-col gap-1">
            <p className="font-medium">{authSession?.data?.user?.name ?? "–"}</p>
            <p className="text-sm text-muted-foreground">
              {authSession?.data?.user?.email ?? "–"}
            </p>
          </div>
        </section>

        <Separator className="mb-8" />

        {/* Profile settings */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Profil treningowy
          </h2>

          {isPending ? (
            <p className="text-muted-foreground text-sm">Ładowanie…</p>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div>
                <Label className="mb-2 block text-sm">Cel treningowy</Label>
                <RadioGroup
                  value={goal}
                  onValueChange={(v) => setGoal(v as Goal)}
                  className="flex gap-4"
                >
                  {goalOptions.map((o) => (
                    <div key={o.value} className="flex items-center gap-2">
                      <RadioGroupItem value={o.value} id={`goal-${o.value}`} />
                      <Label htmlFor={`goal-${o.value}`} className="cursor-pointer">
                        {o.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-2 block text-sm">Płeć</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(v) => setGender(v as Gender)}
                  className="flex gap-4"
                >
                  {genderOptions.map((o) => (
                    <div key={o.value} className="flex items-center gap-2">
                      <RadioGroupItem value={o.value} id={`gender-${o.value}`} />
                      <Label htmlFor={`gender-${o.value}`} className="cursor-pointer">
                        {o.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="settings-age" className="mb-1 block text-sm">
                    Wiek
                  </Label>
                  <Input
                    id="settings-age"
                    type="number"
                    min="10"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="np. 25"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="settings-weight" className="mb-1 block text-sm">
                    Waga startowa (kg)
                  </Label>
                  <Input
                    id="settings-weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="np. 75.0"
                  />
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
              {saved && (
                <p className="text-green-400 text-sm">Zapisano zmiany!</p>
              )}

              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="self-start"
              >
                {updateProfile.isPending ? "Zapisywanie…" : "Zapisz zmiany"}
              </Button>
            </form>
          )}
        </section>

        <Separator className="my-8" />

        {/* Sign out */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Sesja
          </h2>
          <Button variant="destructive" onClick={handleSignOut}>
            Wyloguj się
          </Button>
        </section>
      </motion.div>
    </main>
  );
}
