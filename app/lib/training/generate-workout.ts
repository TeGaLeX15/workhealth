// app/lib/training/generate-workout.ts
import { exerciseProfiles } from "./exercise-profiles";
import type { ExerciseSlug, Workout, WorkoutSet } from "./types";

export function isSupportedExercise(slug: string): slug is ExerciseSlug {
  return slug in exerciseProfiles;
}

export function generateWorkout(
  exercise: ExerciseSlug,
  maxReps: number,
): Workout {
  if (!Number.isFinite(maxReps) || maxReps <= 0) {
    throw new Error("maxReps must be a positive number");
  }

  const profile = exerciseProfiles[exercise];

  if (!profile) {
    throw new Error(`Unknown exercise: ${exercise}`);
  }

  const sets: WorkoutSet[] = [];

  for (let i = 0; i < profile.sets; i++) {
    const intensity = Math.max(
      profile.maxIntensity - profile.fatigueRate * i,
      profile.minIntensity,
    );

    const targetReps = Math.max(
      Math.round(maxReps * intensity),
      profile.minReps,
    );

    sets.push({
      setNumber: i + 1,
      targetReps,
    });
  }

  return {
    exercise,
    maxReps,
    sets,
  };
}
