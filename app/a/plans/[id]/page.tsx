"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categoryGradients: Record<string, string> = {
  strength: "from-green-500/20",
  cardio: "from-blue-500/20",
  hiit: "from-red-500/20",
  flexibility: "from-purple-500/20",
};

const categoryLabels: Record<string, string> = {
  strength: "Siła",
  cardio: "Kardio",
  hiit: "HIIT",
  flexibility: "Elastyczność",
};

const difficultyLabels: Record<string, string> = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
};

type Exercise = {
  id: string;
  name: string;
  description: string;
  sets: number | null;
  reps: number | null;
  durationSeconds: number | null;
};

type Workout = {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  exercises: Exercise[];
};

function formatDuration(seconds: number) {
  if (seconds >= 60) return `${Math.round(seconds / 60)} min`;
  return `${seconds} s`;
}

function ExerciseMeta({ exercise }: { exercise: Exercise }) {
  if (exercise.durationSeconds) {
    return (
      <span className="text-xs text-muted-foreground">
        {exercise.sets && exercise.sets > 1 ? `${exercise.sets}×` : ""}
        {formatDuration(exercise.durationSeconds)}
      </span>
    );
  }
  if (exercise.sets && exercise.reps) {
    return (
      <span className="text-xs text-muted-foreground">
        {exercise.sets}×{exercise.reps} powtórzeń
      </span>
    );
  }
  return null;
}

function WorkoutItem({
  workout,
  isCompleted,
  isEnrolled,
  onComplete,
  completing,
  completedExerciseIds,
  onToggleExercise,
}: {
  workout: Workout;
  isCompleted: boolean;
  isEnrolled: boolean;
  onComplete: (notes?: string) => void;
  completing: boolean;
  completedExerciseIds: string[] | undefined;
  onToggleExercise: (exerciseId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!initialized && completedExerciseIds !== undefined) {
      setCheckedExercises(
        new Set(workout.exercises.filter((ex) => completedExerciseIds.includes(ex.id)).map((ex) => ex.id))
      );
      setInitialized(true);
    }
  }, [completedExerciseIds, initialized, workout.exercises]);

  const allChecked = workout.exercises.length > 0 && checkedExercises.size === workout.exercises.length;
  const anyChecked = checkedExercises.size > 0;

  function toggleExercise(id: string) {
    setCheckedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onToggleExercise(id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border transition-colors",
        isCompleted ? "border-[var(--neon)]/40 bg-[var(--neon)]/5" : "border-border"
      )}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground w-10 shrink-0">
            Dzień {workout.dayNumber}
          </span>
          <div>
            <p className="font-medium">{workout.title}</p>
            <p className="text-xs text-muted-foreground">{workout.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          {isCompleted && <CheckCircle2 size={18} className="text-[var(--neon)]" />}
          {!isCompleted && anyChecked && (
            <span className="text-xs text-muted-foreground">
              {checkedExercises.size}/{workout.exercises.length}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {workout.durationMinutes} min
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={16} className="text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
              {workout.exercises.map((ex) => (
                <div key={ex.id} className="flex items-start gap-3">
                  {isEnrolled && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => toggleExercise(ex.id)}
                      className="mt-0.5 shrink-0"
                      aria-label={checkedExercises.has(ex.id) ? "Odznacz" : "Zaznacz"}
                    >
                      {checkedExercises.has(ex.id) ? (
                        <CheckCircle2 size={18} className="text-[var(--neon)]" />
                      ) : (
                        <Circle size={18} className="text-muted-foreground" />
                      )}
                    </button>
                  )}
                  {isCompleted && (
                    <CheckCircle2 size={18} className="text-[var(--neon)] mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-sm font-medium", checkedExercises.has(ex.id) && "line-through text-muted-foreground")}>{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.description}</p>
                    </div>
                    <ExerciseMeta exercise={ex} />
                  </div>
                </div>
              ))}

              {isEnrolled && !isCompleted && allChecked && (
                <div className="mt-4 space-y-2 border-t border-border pt-3">
                  <p className="text-xs text-[var(--neon)] font-medium">Wszystkie ćwiczenia ukończone! 💪</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notatki z treningu (opcjonalnie)…"
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--neon)]/50 resize-none"
                  />
                  <Button
                    size="sm"
                    className="w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/80"
                    onClick={() => onComplete(notes)}
                    disabled={completing}
                  >
                    {completing ? "Zapisuję…" : "Zapisz trening ✓"}
                  </Button>
                </div>
              )}

              {isEnrolled && !isCompleted && !allChecked && anyChecked && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                  Zaznacz pozostałe ćwiczenia, aby ukończyć trening.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlanDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: plan, isPending } = trpc.plans.getById.useQuery({ id });
  const { data: enrollments } = trpc.progress.getEnrollments.useQuery();
  const { data: completedWorkoutIds } = trpc.progress.getCompletedWorkouts.useQuery();
  const { data: completedExerciseIds } = trpc.progress.getCompletedExercises.useQuery();

  const utils = trpc.useUtils();
  const enrollMutation = trpc.progress.enrollInPlan.useMutation({
    onSuccess: () => utils.progress.getEnrollments.invalidate(),
  });
  const completeWorkoutMutation = trpc.progress.completeWorkout.useMutation({
    onSuccess: () => {
      utils.progress.getCompletedWorkouts.invalidate();
      toast.success("Trening ukończony! 💪", {
        description: "Świetna robota! Twój postęp został zapisany.",
      });
    },
  });
  const toggleExerciseMutation = trpc.progress.toggleExercise.useMutation({
    onSuccess: () => utils.progress.getCompletedExercises.invalidate(),
  });
  const markPlanCompleteMutation = trpc.progress.markPlanComplete.useMutation({
    onSuccess: () => {
      utils.progress.getEnrollments.invalidate();
      utils.progress.getActivePlan.invalidate();
      toast.success("Plan ukończony! 🏆", {
        description: "Gratulacje! Ukończyłeś cały plan treningowy.",
      });
    },
  });

  const enrollment = enrollments?.find((e) => e.planId === id);

  if (isPending) {
    return (
      <main className="p-6 md:p-8 max-w-3xl mx-auto">
        <Skeleton className="h-48 rounded-xl mb-6" />
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="p-8 text-muted-foreground">
        Plan nie znaleziony.{" "}
        <Link href="/a/plans" className="underline">
          Wróć do listy
        </Link>
      </main>
    );
  }

  const workouts = plan.workouts ?? [];
  const totalWorkouts = workouts.length;
  const completedCount = workouts.filter((w) => completedWorkoutIds?.includes(w.id)).length;
  // Exercise-level progress
  const allExerciseIds = workouts.flatMap((w) => w.exercises.map((ex) => ex.id));
  const totalExercises = allExerciseIds.length;
  const exercisesInCompletedWorkouts = workouts
    .filter((w) => completedWorkoutIds?.includes(w.id))
    .flatMap((w) => w.exercises.map((ex) => ex.id));
  const doneExercises = new Set(
    [...(completedExerciseIds ?? []), ...exercisesInCompletedWorkouts].filter((id) => allExerciseIds.includes(id))
  );
  const progressPercent = totalExercises > 0 ? Math.round((doneExercises.size / totalExercises) * 100) : 0;

  return (
    <main className="p-6 md:p-8 max-w-3xl mx-auto">
      <Link
        href="/a/plans"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Wróć do planów
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl bg-gradient-to-br to-transparent bg-card border border-border p-6 mb-5",
          categoryGradients[plan.category] ?? ""
        )}
      >
        <div className="flex gap-2 mb-3 flex-wrap items-center">
          <Badge variant="outline">{categoryLabels[plan.category]}</Badge>
          <Badge variant="outline">{difficultyLabels[plan.difficulty]}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={13} />
            {plan.durationWeeks} tygodnie
          </span>
        </div>
        <h1 className="heading text-4xl neon mb-2">{plan.name}</h1>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </motion.div>

      {/* Enrollment / Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border p-5 mb-6"
      >
        {enrollment ? (
          <div>
            <p className="text-sm font-medium mb-2">
              Twój postęp: {doneExercises.size}/{totalExercises} ćwiczeń ({completedCount}/{totalWorkouts} treningów)
            </p>
            <Progress value={progressPercent} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground mt-1">{progressPercent}% ukończono</p>
            {progressPercent === 100 && !enrollment.completedAt && (
              <Button
                className="mt-4 bg-[var(--neon)] text-black hover:bg-[var(--neon)]/80"
                onClick={() => markPlanCompleteMutation.mutate({ enrollmentId: enrollment.id })}
                disabled={markPlanCompleteMutation.isPending}
              >
                {markPlanCompleteMutation.isPending ? "Zapisuję…" : "Zakończ plan 🏆"}
              </Button>
            )}
            {enrollment.completedAt && (
              <p className="text-xs text-[var(--neon)] mt-3 flex items-center gap-1">
                <CheckCircle2 size={13} />
                Plan ukończony
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium">Nie jesteś jeszcze zapisany</p>
              <p className="text-sm text-muted-foreground">
                Dołącz do planu i śledź swój postęp
              </p>
            </div>
            <Button
              onClick={() => enrollMutation.mutate({ planId: id })}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Zapisuję…" : "Dołącz do planu"}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Workouts */}
      <h2 className="heading text-2xl mb-4">Plan Treningów</h2>
      <div className="space-y-3">
        {workouts.map((workout) => (
          <WorkoutItem
            key={workout.id}
            workout={workout}
            isCompleted={completedWorkoutIds?.includes(workout.id) ?? false}
            isEnrolled={!!enrollment}
            onComplete={(notes) => completeWorkoutMutation.mutate({ workoutId: workout.id, notes })}
            completing={completeWorkoutMutation.isPending}
            completedExerciseIds={completedExerciseIds}
            onToggleExercise={(exerciseId) => toggleExerciseMutation.mutate({ exerciseId })}
          />
        ))}
      </div>
    </main>
  );
}
