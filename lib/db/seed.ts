import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

type DB = BetterSQLite3Database<typeof schema>;

const PLANS: Array<{
  plan: typeof schema.fitnessPlan.$inferInsert;
  workouts: Array<{
    workout: typeof schema.planWorkout.$inferInsert;
    exercises: (typeof schema.workoutExercise.$inferInsert)[];
  }>;
}> = [
  {
    plan: {
      id: "plan-strength-001",
      name: "Siła Absolutna",
      description:
        "Klasyczny program siłowy 3-dniowy skupiony na ćwiczeniach złożonych. Zbudujesz solidną masę mięśniową i znacznie zwiększysz siłę.",
      category: "strength",
      difficulty: "intermediate",
      durationWeeks: 8,
      targetGoal: "gain_mass",
      imageSlug: "strength-absolute",
    },
    workouts: [
      {
        workout: {
          id: "wo-strength-push",
          planId: "plan-strength-001",
          dayNumber: 1,
          title: "Trening Push",
          description: "Klatka piersiowa, barki i triceps",
          durationMinutes: 60,
          imageSlug: "push-day",
        },
        exercises: [
          { id: "ex-sp-1", workoutId: "wo-strength-push", order: 1, name: "Wyciskanie na ławce poziomej", description: "Ćwiczenie fundamentalne na klatkę piersiową", sets: 4, reps: 8, durationSeconds: null, imageSlug: "bench-press" },
          { id: "ex-sp-2", workoutId: "wo-strength-push", order: 2, name: "Wyciskanie żołnierskie", description: "Barki i górne partie ciała z pozycji stojącej", sets: 3, reps: 10, durationSeconds: null, imageSlug: "ohp" },
          { id: "ex-sp-3", workoutId: "wo-strength-push", order: 3, name: "Rozpiętki ze sztangielkami", description: "Izolacja klatki piersiowej na ławce poziomej", sets: 3, reps: 12, durationSeconds: null, imageSlug: "dumbbell-fly" },
          { id: "ex-sp-4", workoutId: "wo-strength-push", order: 4, name: "Pompki na poręczach", description: "Triceps i dolna część klatki", sets: 3, reps: 12, durationSeconds: null, imageSlug: "dips" },
          { id: "ex-sp-5", workoutId: "wo-strength-push", order: 5, name: "Prostowanie ramion na wyciągu", description: "Izolacja tricepsa", sets: 4, reps: 12, durationSeconds: null, imageSlug: "tricep-pushdown" },
        ],
      },
      {
        workout: {
          id: "wo-strength-pull",
          planId: "plan-strength-001",
          dayNumber: 2,
          title: "Trening Pull",
          description: "Plecy i biceps",
          durationMinutes: 60,
          imageSlug: "pull-day",
        },
        exercises: [
          { id: "ex-spl-1", workoutId: "wo-strength-pull", order: 1, name: "Wiosłowanie sztangą", description: "Główne ćwiczenie na mięśnie pleców", sets: 4, reps: 8, durationSeconds: null, imageSlug: "barbell-row" },
          { id: "ex-spl-2", workoutId: "wo-strength-pull", order: 2, name: "Podciąganie na drążku", description: "Szerokie plecy i biceps", sets: 3, reps: 8, durationSeconds: null, imageSlug: "pull-up" },
          { id: "ex-spl-3", workoutId: "wo-strength-pull", order: 3, name: "Wiosłowanie na maszynie", description: "Środkowe partie pleców", sets: 3, reps: 12, durationSeconds: null, imageSlug: "cable-row" },
          { id: "ex-spl-4", workoutId: "wo-strength-pull", order: 4, name: "Uginanie ramion ze sztangielkami", description: "Klasyczny biceps", sets: 3, reps: 12, durationSeconds: null, imageSlug: "dumbbell-curl" },
          { id: "ex-spl-5", workoutId: "wo-strength-pull", order: 5, name: "Face pull", description: "Tylne deltoidy i rotatory stożka", sets: 3, reps: 15, durationSeconds: null, imageSlug: "face-pull" },
        ],
      },
      {
        workout: {
          id: "wo-strength-legs",
          planId: "plan-strength-001",
          dayNumber: 3,
          title: "Trening Nogi",
          description: "Nogi i pośladki",
          durationMinutes: 75,
          imageSlug: "leg-day",
        },
        exercises: [
          { id: "ex-sl-1", workoutId: "wo-strength-legs", order: 1, name: "Przysiad ze sztangą", description: "Król ćwiczeń na nogi", sets: 4, reps: 8, durationSeconds: null, imageSlug: "squat" },
          { id: "ex-sl-2", workoutId: "wo-strength-legs", order: 2, name: "Wyciskanie nóg na suwnicy", description: "Czwórki i pośladki", sets: 4, reps: 10, durationSeconds: null, imageSlug: "leg-press" },
          { id: "ex-sl-3", workoutId: "wo-strength-legs", order: 3, name: "Martwy ciąg rumuński", description: "Tylna część ud i pośladki", sets: 3, reps: 10, durationSeconds: null, imageSlug: "rdl" },
          { id: "ex-sl-4", workoutId: "wo-strength-legs", order: 4, name: "Wykroki ze sztangielkami", description: "Czwórki i koordynacja", sets: 3, reps: 12, durationSeconds: null, imageSlug: "lunges" },
          { id: "ex-sl-5", workoutId: "wo-strength-legs", order: 5, name: "Wspięcia na palce", description: "Łydki stojące", sets: 4, reps: 20, durationSeconds: null, imageSlug: "calf-raise" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-hiit-001",
      name: "Sprint i Spalanie",
      description:
        "Intensywny program HIIT zaprojektowany dla maksymalnego spalania tkanki tłuszczowej i poprawy wydolności w zaledwie 6 tygodniach.",
      category: "hiit",
      difficulty: "advanced",
      durationWeeks: 6,
      targetGoal: "lose_weight",
      imageSlug: "hiit-sprint",
    },
    workouts: [
      {
        workout: {
          id: "wo-hiit-tabata",
          planId: "plan-hiit-001",
          dayNumber: 1,
          title: "Tabata Intensywna",
          description: "4 ćwiczenia, 8 rund – 20 s praca / 10 s odpoczynek",
          durationMinutes: 45,
          imageSlug: "tabata",
        },
        exercises: [
          { id: "ex-ht-1", workoutId: "wo-hiit-tabata", order: 1, name: "Burpees", description: "Pełne ciało – burpee z wyskokiem i klaśnięciem", sets: 8, reps: null, durationSeconds: 20, imageSlug: "burpees" },
          { id: "ex-ht-2", workoutId: "wo-hiit-tabata", order: 2, name: "Skoki do klaśnięcia", description: "Wybuchowe skoki z klaśnięciem nad głową", sets: 8, reps: null, durationSeconds: 20, imageSlug: "clap-jumps" },
          { id: "ex-ht-3", workoutId: "wo-hiit-tabata", order: 3, name: "Mountain Climbers", description: "Dynamiczne wspinanie w podporze przodem", sets: 8, reps: null, durationSeconds: 20, imageSlug: "mountain-climbers" },
          { id: "ex-ht-4", workoutId: "wo-hiit-tabata", order: 4, name: "High Knees", description: "Bieg w miejscu z unoszeniem kolan do pasa", sets: 8, reps: null, durationSeconds: 20, imageSlug: "high-knees" },
        ],
      },
      {
        workout: {
          id: "wo-hiit-circuit",
          planId: "plan-hiit-001",
          dayNumber: 2,
          title: "Obwód Pełnego Ciała",
          description: "3 rundy obwodowe z 60 s przerwy między rundami",
          durationMinutes: 50,
          imageSlug: "circuit",
        },
        exercises: [
          { id: "ex-hc-1", workoutId: "wo-hiit-circuit", order: 1, name: "Przysiady z wyskokiem", description: "Eksplozja z pozycji pełnego przysiadu", sets: 3, reps: 15, durationSeconds: null, imageSlug: "jump-squats" },
          { id: "ex-hc-2", workoutId: "wo-hiit-circuit", order: 2, name: "Push-ups", description: "Pompki – tempo 2-0-1", sets: 3, reps: 20, durationSeconds: null, imageSlug: "push-ups" },
          { id: "ex-hc-3", workoutId: "wo-hiit-circuit", order: 3, name: "Skoki na skrzynię", description: "Wybuchowa siła nóg", sets: 3, reps: 10, durationSeconds: null, imageSlug: "box-jumps" },
          { id: "ex-hc-4", workoutId: "wo-hiit-circuit", order: 4, name: "Plank", description: "Statyczna praca core – utrzymaj pozycję", sets: 3, reps: null, durationSeconds: 60, imageSlug: "plank" },
        ],
      },
      {
        workout: {
          id: "wo-hiit-sprint",
          planId: "plan-hiit-001",
          dayNumber: 3,
          title: "Sprint Interwałowy",
          description: "Sprinty na bieżni lub na świeżym powietrzu",
          durationMinutes: 40,
          imageSlug: "sprint",
        },
        exercises: [
          { id: "ex-hs-1", workoutId: "wo-hiit-sprint", order: 1, name: "Rozgrzewka jogging", description: "Wolny bieg przygotowujący mięśnie", sets: 1, reps: null, durationSeconds: 600, imageSlug: "jogging" },
          { id: "ex-hs-2", workoutId: "wo-hiit-sprint", order: 2, name: "Sprint 30 s / Odpoczynek 90 s", description: "Maksymalna intensywność przez 30 sekund, 8 powtórzeń", sets: 8, reps: null, durationSeconds: 30, imageSlug: "sprint-interval" },
          { id: "ex-hs-3", workoutId: "wo-hiit-sprint", order: 3, name: "Cool down", description: "Spokojny spacer i stopniowe zwolnienie tętna", sets: 1, reps: null, durationSeconds: 600, imageSlug: "cooldown" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-cardio-001",
      name: "Cardio Podstawy",
      description:
        "Łagodny program kardio dla osób zaczynających przygodę z aktywnością fizyczną. Stopniowo zwiększa wytrzymałość i pomaga spalać kalorie.",
      category: "cardio",
      difficulty: "beginner",
      durationWeeks: 4,
      targetGoal: "lose_weight",
      imageSlug: "cardio-basics",
    },
    workouts: [
      {
        workout: {
          id: "wo-cardio-run",
          planId: "plan-cardio-001",
          dayNumber: 1,
          title: "Spacer i Bieg",
          description: "Połączenie energicznego marszu i lekkiego joggingu",
          durationMinutes: 40,
          imageSlug: "walking-run",
        },
        exercises: [
          { id: "ex-cr-1", workoutId: "wo-cardio-run", order: 1, name: "Szybki chód", description: "Energiczny marsz w dobrym tempie", sets: 1, reps: null, durationSeconds: 1200, imageSlug: "brisk-walk" },
          { id: "ex-cr-2", workoutId: "wo-cardio-run", order: 2, name: "Lekki jogging", description: "Wolny bieg – powinieneś móc rozmawiać", sets: 1, reps: null, durationSeconds: 900, imageSlug: "light-jog" },
          { id: "ex-cr-3", workoutId: "wo-cardio-run", order: 3, name: "Cooldown spacer", description: "Spokojny marsz na zakończenie", sets: 1, reps: null, durationSeconds: 300, imageSlug: "cooldown-walk" },
        ],
      },
      {
        workout: {
          id: "wo-cardio-bike",
          planId: "plan-cardio-001",
          dayNumber: 2,
          title: "Rower Stacjonarny",
          description: "Bezpieczna i skuteczna praca na rowerze stacjonarnym",
          durationMinutes: 45,
          imageSlug: "stationary-bike",
        },
        exercises: [
          { id: "ex-cb-1", workoutId: "wo-cardio-bike", order: 1, name: "Jazda niska intensywność", description: "Rozkręcenie, minimalny opór", sets: 1, reps: null, durationSeconds: 900, imageSlug: "bike-low" },
          { id: "ex-cb-2", workoutId: "wo-cardio-bike", order: 2, name: "Jazda umiarkowana", description: "Podwyższony opór, stabilne tempo tętna", sets: 1, reps: null, durationSeconds: 1200, imageSlug: "bike-medium" },
          { id: "ex-cb-3", workoutId: "wo-cardio-bike", order: 3, name: "Cooldown jazda", description: "Stopniowe zmniejszanie intensywności", sets: 1, reps: null, durationSeconds: 600, imageSlug: "bike-cooldown" },
        ],
      },
      {
        workout: {
          id: "wo-cardio-mix",
          planId: "plan-cardio-001",
          dayNumber: 3,
          title: "Trening Mieszany",
          description: "Skakanka, ćwiczenia ogólnorozwojowe i rozciąganie",
          durationMinutes: 35,
          imageSlug: "mixed-cardio",
        },
        exercises: [
          { id: "ex-cm-1", workoutId: "wo-cardio-mix", order: 1, name: "Skakanka", description: "Skoki na skakance w ustalonym tempie", sets: 3, reps: null, durationSeconds: 180, imageSlug: "jump-rope" },
          { id: "ex-cm-2", workoutId: "wo-cardio-mix", order: 2, name: "Pajacyki", description: "Jumping Jacks – klasyczne ćwiczenie kardio", sets: 3, reps: 30, durationSeconds: null, imageSlug: "jumping-jacks" },
          { id: "ex-cm-3", workoutId: "wo-cardio-mix", order: 3, name: "Stretching końcowy", description: "Rozciąganie całego ciała na zakończenie", sets: 1, reps: null, durationSeconds: 600, imageSlug: "stretching" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-flex-001",
      name: "Mobilność i Równowaga",
      description:
        "Program poprawiający elastyczność, mobilność stawów i równowagę. Doskonały jako uzupełnienie treningu siłowego lub samodzielny plan.",
      category: "flexibility",
      difficulty: "beginner",
      durationWeeks: 6,
      targetGoal: "both",
      imageSlug: "mobility-balance",
    },
    workouts: [
      {
        workout: {
          id: "wo-flex-dynamic",
          planId: "plan-flex-001",
          dayNumber: 1,
          title: "Rozciąganie Dynamiczne",
          description: "Aktywne ćwiczenia poprawiające zakres ruchu",
          durationMinutes: 30,
          imageSlug: "dynamic-stretch",
        },
        exercises: [
          { id: "ex-fd-1", workoutId: "wo-flex-dynamic", order: 1, name: "Krążenia ramionami", description: "Rozgrzewka stawów barkowych", sets: 3, reps: 15, durationSeconds: null, imageSlug: "arm-circles" },
          { id: "ex-fd-2", workoutId: "wo-flex-dynamic", order: 2, name: "Wymachy nóg", description: "Mobilność bioder – przód, tył i boczne", sets: 3, reps: 15, durationSeconds: null, imageSlug: "leg-swings" },
          { id: "ex-fd-3", workoutId: "wo-flex-dynamic", order: 3, name: "Rotacje tułowia", description: "Kręgosłup piersiowy i lędźwiowy", sets: 3, reps: 15, durationSeconds: null, imageSlug: "torso-rotations" },
          { id: "ex-fd-4", workoutId: "wo-flex-dynamic", order: 4, name: "Wykroki z rotacją", description: "Dynamiczne wykroki z obrotem klatki", sets: 3, reps: 10, durationSeconds: null, imageSlug: "lunge-rotation" },
        ],
      },
      {
        workout: {
          id: "wo-flex-yoga",
          planId: "plan-flex-001",
          dayNumber: 2,
          title: "Pozycje Jogi",
          description: "Podstawowe asany jogi dla elastyczności i spokoju",
          durationMinutes: 45,
          imageSlug: "yoga-poses",
        },
        exercises: [
          { id: "ex-fy-1", workoutId: "wo-flex-yoga", order: 1, name: "Pies z głową w dół", description: "Rozciąganie tylnej linii ciała", sets: 3, reps: null, durationSeconds: 30, imageSlug: "downward-dog" },
          { id: "ex-fy-2", workoutId: "wo-flex-yoga", order: 2, name: "Wojownik I", description: "Biodra, nogi i stabilizacja tułowia", sets: 2, reps: null, durationSeconds: 30, imageSlug: "warrior-1" },
          { id: "ex-fy-3", workoutId: "wo-flex-yoga", order: 3, name: "Pozycja dziecka", description: "Głębokie rozciąganie pleców i bioder", sets: 3, reps: null, durationSeconds: 60, imageSlug: "child-pose" },
          { id: "ex-fy-4", workoutId: "wo-flex-yoga", order: 4, name: "Gołąb siedzący", description: "Intensywne rozciąganie rotatorów biodra", sets: 2, reps: null, durationSeconds: 45, imageSlug: "pigeon-pose" },
        ],
      },
      {
        workout: {
          id: "wo-flex-pilates",
          planId: "plan-flex-001",
          dayNumber: 3,
          title: "Pilates Core",
          description: "Ćwiczenia wzmacniające centrum ciała",
          durationMinutes: 40,
          imageSlug: "pilates-core",
        },
        exercises: [
          { id: "ex-fp-1", workoutId: "wo-flex-pilates", order: 1, name: "Dead Bug", description: "Stabilizacja kręgosłupa z koordynacją kończyn", sets: 3, reps: 10, durationSeconds: null, imageSlug: "dead-bug" },
          { id: "ex-fp-2", workoutId: "wo-flex-pilates", order: 2, name: "Bird Dog", description: "Równowaga i izometryczne wzmocnienie core", sets: 3, reps: 10, durationSeconds: null, imageSlug: "bird-dog" },
          { id: "ex-fp-3", workoutId: "wo-flex-pilates", order: 3, name: "Mostek", description: "Pośladki i stabilizacja miednicy", sets: 3, reps: 15, durationSeconds: null, imageSlug: "bridge" },
          { id: "ex-fp-4", workoutId: "wo-flex-pilates", order: 4, name: "Deska boczna", description: "Mięśnie skośne brzucha i stabilizatory", sets: 3, reps: null, durationSeconds: 30, imageSlug: "side-plank" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-strength-002",
      name: "Budowanie Masy 5x",
      description: "Pięciodniowy plan siłowy ukierunkowany na duże ciężary i regenerację.",
      category: "strength",
      difficulty: "intermediate",
      durationWeeks: 10,
      targetGoal: "gain_mass",
      imageSlug: "strength-mass-5x",
    },
    workouts: [
      {
        workout: {
          id: "wo-strength-5x",
          planId: "plan-strength-002",
          dayNumber: 1,
          title: "Full Body Heavy",
          description: "Trening całego ciała z głównym naciskiem na siłę.",
          durationMinutes: 70,
          imageSlug: "fullbody-heavy",
        },
        exercises: [
          { id: "ex-s5x-1", workoutId: "wo-strength-5x", order: 1, name: "Przysiad tylni", description: "Podstawowe ćwiczenie na siłę nóg", sets: 4, reps: 6, durationSeconds: null, imageSlug: "back-squat" },
          { id: "ex-s5x-2", workoutId: "wo-strength-5x", order: 2, name: "Wyciskanie na ławce", description: "Mocne piersi i triceps", sets: 4, reps: 6, durationSeconds: null, imageSlug: "bench-press" },
          { id: "ex-s5x-3", workoutId: "wo-strength-5x", order: 3, name: "Wiosłowanie sztangą", description: "Buduje masę pleców", sets: 4, reps: 6, durationSeconds: null, imageSlug: "barbell-row" },
          { id: "ex-s5x-4", workoutId: "wo-strength-5x", order: 4, name: "Martwy ciąg klasyczny", description: "Pełne plecy i tył uda", sets: 3, reps: 5, durationSeconds: null, imageSlug: "deadlift" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-strength-003",
      name: "Siła Związana z Obciążeniem",
      description: "Zaawansowany plan siłowy z progresją ciężaru i kluczową techniką.",
      category: "strength",
      difficulty: "advanced",
      durationWeeks: 8,
      targetGoal: "gain_mass",
      imageSlug: "strength-power",
    },
    workouts: [
      {
        workout: {
          id: "wo-strength-power",
          planId: "plan-strength-003",
          dayNumber: 1,
          title: "Trening Power",
          description: "Mega ciężary, niskie powtórzenia i dłuższe przerwy.",
          durationMinutes: 70,
          imageSlug: "power-training",
        },
        exercises: [
          { id: "ex-sp-1", workoutId: "wo-strength-power", order: 1, name: "Martwy ciąg", description: "Podstawowe ćwiczenie na siłę całego ciała", sets: 5, reps: 5, durationSeconds: null, imageSlug: "deadlift" },
          { id: "ex-sp-2", workoutId: "wo-strength-power", order: 2, name: "Wyciskanie żołnierskie", description: "Barki i triceps z ciężarem w górze", sets: 4, reps: 6, durationSeconds: null, imageSlug: "military-press" },
          { id: "ex-sp-3", workoutId: "wo-strength-power", order: 3, name: "Podciąganie szerokim nachwytem", description: "Mocne plecy i biceps", sets: 4, reps: 6, durationSeconds: null, imageSlug: "wide-pullup" },
          { id: "ex-sp-4", workoutId: "wo-strength-power", order: 4, name: "Przysiad przedni", description: "Siła nóg i stabilizacja tułowia", sets: 4, reps: 6, durationSeconds: null, imageSlug: "front-squat" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-cardio-002",
      name: "Kardio Obwodowe",
      description: "Obwodowy plan spalający tłuszcz, wzmacniający wydolność i przyspieszający metabolizm.",
      category: "cardio",
      difficulty: "intermediate",
      durationWeeks: 6,
      targetGoal: "lose_weight",
      imageSlug: "cardio-circuit",
    },
    workouts: [
      {
        workout: {
          id: "wo-cardio-circuit",
          planId: "plan-cardio-002",
          dayNumber: 1,
          title: "Obwód Funkcjonalny",
          description: "6 stacji z minimalnymi przerwami dla spalania tłuszczu.",
          durationMinutes: 45,
          imageSlug: "functional-circuit",
        },
        exercises: [
          { id: "ex-cc-1", workoutId: "wo-cardio-circuit", order: 1, name: "Burpees", description: "Wysokointensywne spalanie", sets: 4, reps: 12, durationSeconds: null, imageSlug: "burpees" },
          { id: "ex-cc-2", workoutId: "wo-cardio-circuit", order: 2, name: "Skakanka", description: "Szybkie skoki na wytrzymałość", sets: 4, reps: null, durationSeconds: 120, imageSlug: "jump-rope" },
          { id: "ex-cc-3", workoutId: "wo-cardio-circuit", order: 3, name: "Mountain Climbers", description: "Praca core i serca jednocześnie", sets: 4, reps: null, durationSeconds: 45, imageSlug: "mountain-climbers" },
          { id: "ex-cc-4", workoutId: "wo-cardio-circuit", order: 4, name: "Wykroki z wyskokiem", description: "Dynamiczne nogi i wytrzymałość", sets: 4, reps: 12, durationSeconds: null, imageSlug: "jump-lunges" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-cardio-003",
      name: "Kardio na Świeżym Powietrzu",
      description: "Plan plenerowy z bieganiem, sprintami i ćwiczeniami mobilizującymi.",
      category: "cardio",
      difficulty: "intermediate",
      durationWeeks: 5,
      targetGoal: "lose_weight",
      imageSlug: "outdoor-cardio",
    },
    workouts: [
      {
        workout: {
          id: "wo-cardio-outdoor",
          planId: "plan-cardio-003",
          dayNumber: 1,
          title: "Bieg i Sprinty",
          description: "Naturalne cardio z szybkością i wytrzymałością.",
          durationMinutes: 50,
          imageSlug: "run-sprints",
        },
        exercises: [
          { id: "ex-co-1", workoutId: "wo-cardio-outdoor", order: 1, name: "Bieg ciągły", description: "Tempo komfortowe dla 20 minut", sets: 1, reps: null, durationSeconds: 1200, imageSlug: "steady-run" },
          { id: "ex-co-2", workoutId: "wo-cardio-outdoor", order: 2, name: "Sprinty 100m", description: "Krótki sprint z pełną prędkością", sets: 6, reps: null, durationSeconds: null, imageSlug: "sprints" },
          { id: "ex-co-3", workoutId: "wo-cardio-outdoor", order: 3, name: "Marsz regeneracyjny", description: "Odpoczynek aktywny po sprintach", sets: 1, reps: null, durationSeconds: 600, imageSlug: "walk" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-hiit-002",
      name: "HIIT dla Początkujących",
      description: "Krótki, przystępny program HIIT, który przyspiesza metabolizm bez przeciążania stawów.",
      category: "hiit",
      difficulty: "beginner",
      durationWeeks: 4,
      targetGoal: "lose_weight",
      imageSlug: "hiit-beginner",
    },
    workouts: [
      {
        workout: {
          id: "wo-hiit-beginner",
          planId: "plan-hiit-002",
          dayNumber: 1,
          title: "Wprowadzenie do HIIT",
          description: "Umiarkowane interwały dla lepszej kondycji.",
          durationMinutes: 30,
          imageSlug: "beginner-hiit",
        },
        exercises: [
          { id: "ex-hb-1", workoutId: "wo-hiit-beginner", order: 1, name: "Pajacyki", description: "Klasyczne pajacyki na rozgrzewkę", sets: 3, reps: 30, durationSeconds: null, imageSlug: "jumping-jacks" },
          { id: "ex-hb-2", workoutId: "wo-hiit-beginner", order: 2, name: "Przysiad z wyskokiem", description: "Lekka eksplozywność dla nóg", sets: 3, reps: 12, durationSeconds: null, imageSlug: "jump-squat" },
          { id: "ex-hb-3", workoutId: "wo-hiit-beginner", order: 3, name: "Rowerek leżący", description: "Ćwiczenie wzmacniające core", sets: 3, reps: null, durationSeconds: 60, imageSlug: "bicycle-crunch" },
          { id: "ex-hb-4", workoutId: "wo-hiit-beginner", order: 4, name: "Deska", description: "Stabilizacja i napięcie mięśni brzucha", sets: 3, reps: null, durationSeconds: 45, imageSlug: "plank" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-hiit-003",
      name: "HIIT w Parze",
      description: "Program treningowy dla dwóch osób z elementami współpracy i rywalizacji.",
      category: "hiit",
      difficulty: "intermediate",
      durationWeeks: 5,
      targetGoal: "both",
      imageSlug: "hiit-pair",
    },
    workouts: [
      {
        workout: {
          id: "wo-hiit-pair",
          planId: "plan-hiit-003",
          dayNumber: 1,
          title: "Partner HIIT",
          description: "Partnerstwo i intensywność w jednym treningu.",
          durationMinutes: 45,
          imageSlug: "partner-hiit",
        },
        exercises: [
          { id: "ex-hp-1", workoutId: "wo-hiit-pair", order: 1, name: "Skok w przód", description: "Dynamiczne przysiady z przeskokiem", sets: 3, reps: 15, durationSeconds: null, imageSlug: "forward-jump" },
          { id: "ex-hp-2", workoutId: "wo-hiit-pair", order: 2, name: "Wyskok z przysiadu", description: "Maksymalna eksplozywność nóg", sets: 3, reps: 12, durationSeconds: null, imageSlug: "jump-squat" },
          { id: "ex-hp-3", workoutId: "wo-hiit-pair", order: 3, name: "Mountain Climbers", description: "Dynamiczna praca całego ciała", sets: 3, reps: null, durationSeconds: 45, imageSlug: "mountain-climbers" },
          { id: "ex-hp-4", workoutId: "wo-hiit-pair", order: 4, name: "Pompki", description: "Wspólna seria na klatkę i triceps", sets: 3, reps: 12, durationSeconds: null, imageSlug: "push-ups" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-flex-002",
      name: "Rozciąganie Grzbietu",
      description: "Plan dedykowany rozciąganiu i regeneracji odcinka lędźwiowego oraz piersiowego.",
      category: "flexibility",
      difficulty: "beginner",
      durationWeeks: 5,
      targetGoal: "both",
      imageSlug: "back-stretch",
    },
    workouts: [
      {
        workout: {
          id: "wo-flex-back",
          planId: "plan-flex-002",
          dayNumber: 1,
          title: "Stretch pleców",
          description: "Bezpieczne rozciąganie i mobilizacja kręgosłupa.",
          durationMinutes: 35,
          imageSlug: "back-stretch-workout",
        },
        exercises: [
          { id: "ex-fb-1", workoutId: "wo-flex-back", order: 1, name: "Koci grzbiet", description: "Rozciąganie kręgosłupa i mobilność", sets: 3, reps: 10, durationSeconds: null, imageSlug: "cat-cow" },
          { id: "ex-fb-2", workoutId: "wo-flex-back", order: 2, name: "Mostek", description: "Delikatne otwarcie klatki piersiowej i spięć pleców", sets: 3, reps: 8, durationSeconds: null, imageSlug: "bridge" },
          { id: "ex-fb-3", workoutId: "wo-flex-back", order: 3, name: "Skręty tułowia", description: "Kontrolowane skręty dla kręgosłupa", sets: 3, reps: 10, durationSeconds: null, imageSlug: "spinal-twist" },
          { id: "ex-fb-4", workoutId: "wo-flex-back", order: 4, name: "Rozciąganie bioder", description: "Odciążenie lędźwi i miednicy", sets: 3, reps: null, durationSeconds: 45, imageSlug: "hip-stretch" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-flex-003",
      name: "Elastyczność Bioder",
      description: "Program koncentrujący się na otwarciu i mobilności bioder.",
      category: "flexibility",
      difficulty: "beginner",
      durationWeeks: 4,
      targetGoal: "both",
      imageSlug: "hip-flexibility",
    },
    workouts: [
      {
        workout: {
          id: "wo-flex-hips",
          planId: "plan-flex-003",
          dayNumber: 1,
          title: "Mobilność bioder",
          description: "Ćwiczenia na otwarcie bioder i poprawę zakresu ruchu.",
          durationMinutes: 30,
          imageSlug: "hip-mobility",
        },
        exercises: [
          { id: "ex-fh-1", workoutId: "wo-flex-hips", order: 1, name: "Wykroki z rotacją", description: "Biodra i miednica w ruchu", sets: 3, reps: 10, durationSeconds: null, imageSlug: "lunge-rotation" },
          { id: "ex-fh-2", workoutId: "wo-flex-hips", order: 2, name: "Pozycja gołębia", description: "Głębokie rozciągnięcie zewnętrznej strony biodra", sets: 2, reps: null, durationSeconds: 45, imageSlug: "pigeon-pose" },
          { id: "ex-fh-3", workoutId: "wo-flex-hips", order: 3, name: "Mostek biodrowy", description: "Aktywacja pośladków i otwarcie bioder", sets: 3, reps: 12, durationSeconds: null, imageSlug: "glute-bridge" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-flex-004",
      name: "Równowaga i Core",
      description: "Program łączący równowagę z silnym centrum ciała.",
      category: "flexibility",
      difficulty: "intermediate",
      durationWeeks: 6,
      targetGoal: "both",
      imageSlug: "balance-core",
    },
    workouts: [
      {
        workout: {
          id: "wo-flex-balance",
          planId: "plan-flex-004",
          dayNumber: 1,
          title: "Stabilność i Core",
          description: "Ćwiczenia na równowagę, stabilizację i mobilność.",
          durationMinutes: 40,
          imageSlug: "balance-core-workout",
        },
        exercises: [
          { id: "ex-fb-1", workoutId: "wo-flex-balance", order: 1, name: "Deska boczna", description: "Boczny core i stabilizacja", sets: 3, reps: null, durationSeconds: 35, imageSlug: "side-plank" },
          { id: "ex-fb-2", workoutId: "wo-flex-balance", order: 2, name: "Przyciąganie kolan", description: "Kontrola centralnej części ciała", sets: 3, reps: 12, durationSeconds: null, imageSlug: "knee-tuck" },
          { id: "ex-fb-3", workoutId: "wo-flex-balance", order: 3, name: "Stanie na jednej nodze", description: "Równowaga i aktywacja mięśni stop", sets: 3, reps: null, durationSeconds: 30, imageSlug: "single-leg-stand" },
          { id: "ex-fb-4", workoutId: "wo-flex-balance", order: 4, name: "Bird Dog", description: "Stabilizacja i ruch kończyn na zmianę", sets: 3, reps: 10, durationSeconds: null, imageSlug: "bird-dog" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-strength-004",
      name: "Full Body 3 Dni",
      description: "Plan trzech dni tygodniowo z pełnym treningiem całego ciała.",
      category: "strength",
      difficulty: "intermediate",
      durationWeeks: 8,
      targetGoal: "both",
      imageSlug: "full-body-3day",
    },
    workouts: [
      {
        workout: {
          id: "wo-strength-fullbody",
          planId: "plan-strength-004",
          dayNumber: 1,
          title: "Full Body Kompletny",
          description: "Pełny trening z równym obciążeniem wszystkich partii.",
          durationMinutes: 65,
          imageSlug: "fullbody-workout",
        },
        exercises: [
          { id: "ex-sfb-1", workoutId: "wo-strength-fullbody", order: 1, name: "Przysiad z kettlebellem", description: "Siła nóg i stabilizacja tułowia", sets: 4, reps: 10, durationSeconds: null, imageSlug: "kettlebell-squat" },
          { id: "ex-sfb-2", workoutId: "wo-strength-fullbody", order: 2, name: "Podciąganie", description: "Plecy i biceps", sets: 4, reps: 8, durationSeconds: null, imageSlug: "pull-up" },
          { id: "ex-sfb-3", workoutId: "wo-strength-fullbody", order: 3, name: "Wyciskanie hantli", description: "Klatka i barki", sets: 4, reps: 10, durationSeconds: null, imageSlug: "dumbbell-press" },
          { id: "ex-sfb-4", workoutId: "wo-strength-fullbody", order: 4, name: "Martwy ciąg rumuński", description: "Tylna część uda i pośladki", sets: 3, reps: 10, durationSeconds: null, imageSlug: "romanian-deadlift" },
        ],
      },
    ],
  },
  {
    plan: {
      id: "plan-cardio-004",
      name: "Kardio + Siła",
      description: "Trening łączący elementy cardio z krótkimi sesjami siłowymi.",
      category: "cardio",
      difficulty: "intermediate",
      durationWeeks: 6,
      targetGoal: "both",
      imageSlug: "cardio-strength",
    },
    workouts: [
      {
        workout: {
          id: "wo-cardio-strength",
          planId: "plan-cardio-004",
          dayNumber: 1,
          title: "Kardio+Siła Mix",
          description: "Naprzemienne sesje cardio i ćwiczeń siłowych.",
          durationMinutes: 55,
          imageSlug: "cardio-strength-mix",
        },
        exercises: [
          { id: "ex-cs-1", workoutId: "wo-cardio-strength", order: 1, name: "Burpees", description: "Kondycja i moc w jednym", sets: 4, reps: 12, durationSeconds: null, imageSlug: "burpees" },
          { id: "ex-cs-2", workoutId: "wo-cardio-strength", order: 2, name: "Wiosłowanie na maszynie", description: "Plecy i serce", sets: 3, reps: 15, durationSeconds: null, imageSlug: "rowing-machine" },
          { id: "ex-cs-3", workoutId: "wo-cardio-strength", order: 3, name: "Skakanka", description: "Sprint w rytmie skakanki", sets: 4, reps: null, durationSeconds: 90, imageSlug: "jump-rope" },
          { id: "ex-cs-4", workoutId: "wo-cardio-strength", order: 4, name: "Plank", description: "Stabilizacja core po wysiłku", sets: 3, reps: null, durationSeconds: 45, imageSlug: "plank" },
        ],
      },
    ],
  },
];

export async function seedDatabase(db: DB) {
  for (const { plan, workouts } of PLANS) {
    const existingPlan = await db.select().from(schema.fitnessPlan).where(eq(schema.fitnessPlan.id, plan.id)).limit(1);
    if (existingPlan.length > 0) continue;

    await db.insert(schema.fitnessPlan).values(plan);
    for (const { workout, exercises } of workouts) {
      await db.insert(schema.planWorkout).values(workout);
      for (const exercise of exercises) {
        await db.insert(schema.workoutExercise).values(exercise);
      }
    }
  }

  console.log("Database seeded with fitness plans.");
}
