import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/init";

type Goal = "gain_mass" | "lose_weight" | "both";
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const RECIPES = [
  {
    id: "rec-001",
    name: "Owsianka z bananem i orzechami",
    description: "Energetyczne śniadanie bogate w węglowodany złożone i zdrowe tłuszcze.",
    calories: 420,
    protein: 14,
    carbs: 62,
    fat: 14,
    mealType: "breakfast" as MealType,
    targetGoal: "gain_mass" as Goal,
    prepMinutes: 10,
    ingredients: ["100g płatki owsiane", "1 banan", "30g orzechy włoskie", "200ml mleko", "1 łyżka miód"],
    steps: ["Ugotuj płatki na mleku", "Pokrój banana w plastry", "Dodaj orzechy i miód", "Wymieszaj i podawaj ciepłe"],
  },
  {
    id: "rec-002",
    name: "Kurczak z ryżem i brokułami",
    description: "Klasyczny posiłek budujący masę mięśniową. Wysoka zawartość białka i węglowodanów.",
    calories: 550,
    protein: 48,
    carbs: 58,
    fat: 8,
    mealType: "lunch" as MealType,
    targetGoal: "gain_mass" as Goal,
    prepMinutes: 25,
    ingredients: ["200g pierś z kurczaka", "150g ryż biały", "200g brokuły", "1 łyżka oliwa", "Sól, pieprz, czosnek"],
    steps: ["Ugotuj ryż", "Ugotuj brokuły na parze", "Usmaż kurczaka na oliwie z czosnkiem", "Podawaj razem"],
  },
  {
    id: "rec-003",
    name: "Sałatka z tuńczykiem",
    description: "Lekki posiłek redukcyjny. Dużo białka, mało kalorii.",
    calories: 280,
    protein: 32,
    carbs: 12,
    fat: 10,
    mealType: "lunch" as MealType,
    targetGoal: "lose_weight" as Goal,
    prepMinutes: 10,
    ingredients: ["1 puszka tuńczyk w sosie własnym", "Mix sałat 100g", "1 pomidor", "0.5 ogórek", "1 łyżka oliwa", "Sok z cytryny"],
    steps: ["Odsącz tuńczyka", "Pokrój warzywa", "Wymieszaj z sałatą", "Skrop oliwą i cytryną"],
  },
  {
    id: "rec-004",
    name: "Jajecznica z warzywami",
    description: "Szybkie, białkowe śniadanie niskokaloryczne.",
    calories: 320,
    protein: 22,
    carbs: 8,
    fat: 22,
    mealType: "breakfast" as MealType,
    targetGoal: "lose_weight" as Goal,
    prepMinutes: 10,
    ingredients: ["3 jajka", "1 papryka czerwona", "0.5 cebula", "1 łyżka masło", "Sól, pieprz, szczypiorek"],
    steps: ["Podsmaż cebulę z papryką na maśle", "Wbij jajka i mieszaj", "Dopraw solą i pieprzem", "Posyp szczypiorkiem"],
  },
  {
    id: "rec-005",
    name: "Shake białkowy z owocami",
    description: "Idealna przekąska potreningowa wspierająca regenerację.",
    calories: 380,
    protein: 35,
    carbs: 44,
    fat: 6,
    mealType: "snack" as MealType,
    targetGoal: "both" as Goal,
    prepMinutes: 5,
    ingredients: ["30g odżywka białkowa waniliowa", "200ml mleko 2%", "100g truskawki mrożone", "0.5 banan", "1 łyżka masło orzechowe"],
    steps: ["Wrzuć wszystkie składniki do blendera", "Blenduj przez 30 sekund", "Podawaj od razu"],
  },
  {
    id: "rec-006",
    name: "Zupa warzywna z soczewicą",
    description: "Sycąca zupa dietetyczna pełna błonnika i roślinnego białka.",
    calories: 290,
    protein: 18,
    carbs: 42,
    fat: 4,
    mealType: "dinner" as MealType,
    targetGoal: "lose_weight" as Goal,
    prepMinutes: 35,
    ingredients: ["150g soczewica czerwona", "2 marchewki", "1 cebula", "2 ząbki czosnku", "1 puszka pomidory", "Kumin, kurkuma, sól"],
    steps: ["Podsmaż cebulę i czosnek", "Dodaj marchewkę i przyprawy", "Dodaj soczewicę i pomidory", "Zalej wodą i gotuj 25 min"],
  },
  {
    id: "rec-007",
    name: "Makaron z mięsem mielonym",
    description: "Treściwy obiad masowy z dużą ilością kalorii i białka.",
    calories: 680,
    protein: 42,
    carbs: 72,
    fat: 22,
    mealType: "dinner" as MealType,
    targetGoal: "gain_mass" as Goal,
    prepMinutes: 30,
    ingredients: ["200g makaron penne", "250g mięso mielone wołowe", "1 puszka passata", "1 cebula", "2 ząbki czosnku", "Oregano, bazylia"],
    steps: ["Ugotuj makaron al dente", "Podsmaż cebulę z czosnkiem", "Dodaj mięso i przesmaż", "Dodaj passatę i gotuj 15 min", "Połącz z makaronem"],
  },
  {
    id: "rec-008",
    name: "Jogurt grecki z granolą",
    description: "Szybka przekąska z żywymi kulturami bakterii i prebiotykami.",
    calories: 310,
    protein: 20,
    carbs: 38,
    fat: 8,
    mealType: "snack" as MealType,
    targetGoal: "both" as Goal,
    prepMinutes: 3,
    ingredients: ["200g jogurt grecki 0%", "40g granola", "1 łyżka miód", "Owoce sezonowe do smaku"],
    steps: ["Przełóż jogurt do miseczki", "Posyp granolą", "Skrop miodem", "Dodaj owoce"],
  },
];

export const dietRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        targetGoal: z.enum(["gain_mass", "lose_weight", "both", "all"]).optional().default("all"),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack", "all"]).optional().default("all"),
      })
    )
    .query(({ input }) => {
      let results = RECIPES;
      if (input.targetGoal !== "all") {
        results = results.filter(
          (r) => r.targetGoal === input.targetGoal || r.targetGoal === "both"
        );
      }
      if (input.mealType !== "all") {
        results = results.filter((r) => r.mealType === input.mealType);
      }
      return results.map(({ steps: _steps, ingredients: _ing, ...r }) => r);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const recipe = RECIPES.find((r) => r.id === input.id);
      if (!recipe) throw new Error("Recipe not found");
      return recipe;
    }),
});
