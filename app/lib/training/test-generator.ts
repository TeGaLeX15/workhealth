import { generateWorkout } from "./generate-workout";
import type { ExerciseSlug } from "./types";

const exercises: ExerciseSlug[] = [
  "pull-ups",
  "push-ups",
  "dips",
  "squats",
];

const maxValues = [5, 8, 10, 15, 20, 30, 50, 100];

for (const exercise of exercises) {
  console.log(`\n=== ${exercise} ===`);

  for (const maxReps of maxValues) {
    const workout = generateWorkout(exercise, maxReps);

    console.log(
      `MAX ${maxReps}:`,
      workout.sets.map((set) => set.targetReps).join(" / "),
    );
  }
}