import { generateWorkout } from "./generate-workout";
import type { ExerciseSlug } from "./types";

const WORKOUTS_PER_WEEK = 3;

export function generateTrainingWeek(
  exercise: ExerciseSlug,
  maxReps: number,
) {
  const workouts = [];

  for (let i = 0; i < WORKOUTS_PER_WEEK; i++) {
    workouts.push({
      workoutNumber: i + 1,
      sets: generateWorkout(exercise, maxReps).sets,
    });
  }

  return {
    maxReps,
    workouts,
  };
}