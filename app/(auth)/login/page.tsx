"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(undefined);

    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const res = await signIn.email({
      email: result.data.email,
      password: result.data.password,
    });

    setLoading(false);

    if (res.error) {
      setServerError("Nieprawidłowy email lub hasło.");
      return;
    }

    router.push("/a/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="heading text-3xl neon">FITFORGE</CardTitle>
            <CardDescription>Zaloguj się do swojego konta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  placeholder="jan@example.com"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive text-sm text-center"
                >
                  {serverError}
                </motion.p>
              )}
              <Button type="submit" disabled={loading} className="w-full mt-1">
                {loading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Nie masz konta?&nbsp;
            <Link href="/register" className="text-foreground underline underline-offset-4 hover:text-neon transition-colors">
              Zarejestruj się
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
