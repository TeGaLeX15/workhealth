// app/lib/training/generate-workout.ts
import { exerciseProfiles } from "./exercise-profiles";
import type { ExerciseSlug, Workout, WorkoutSet } from "./types";

/**
 * Проверяет, поддерживается ли упражнение
 * генератором тренировок.
 *
 * @param slug Идентификатор упражнения.
 * @returns true, если для упражнения существует профиль генерации.
 */
export function isSupportedExercise(slug: string): slug is ExerciseSlug {
  return slug in exerciseProfiles;
}

/**
 * Генерирует тренировку на основе максимального
 * количества повторений пользователя.
 *
 * Для каждого подхода интенсивность постепенно снижается
 * в соответствии с профилем упражнения.
 *
 * @param exercise Идентификатор упражнения.
 * @param maxReps Максимальное количество повторений пользователя.
 * @returns Сгенерированная тренировка с целевыми повторениями.
 *
 * @throws {Error} Если maxReps не является положительным числом.
 * @throws {Error} Если для упражнения отсутствует профиль.
 */
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
