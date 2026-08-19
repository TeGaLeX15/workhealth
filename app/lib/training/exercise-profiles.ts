// app/lib/training/exercise-profiles.ts
import type { ExerciseProfile, ExerciseSlug } from "./types";

/**
 * Профили генерации тренировок для поддерживаемых упражнений.
 *
 * Каждый профиль определяет начальную интенсивность,
 * скорость снижения нагрузки, минимальную интенсивность,
 * количество подходов и минимальное количество повторений.
 */
export const exerciseProfiles: Record<ExerciseSlug, ExerciseProfile> = {
  /**
   * Профиль для подтягиваний.
   */
  "pull-ups": {
    slug: "pull-ups",
    maxIntensity: 0.75,
    fatigueRate: 0.06,
    minIntensity: 0.5,
    sets: 5,
    minReps: 1,
  },

  /**
   * Профиль для отжиманий.
   */
  "push-ups": {
    slug: "push-ups",
    maxIntensity: 0.7,
    fatigueRate: 0.05,
    minIntensity: 0.45,
    sets: 5,
    minReps: 2,
  },

  /**
   * Профиль для отжиманий на брусьях.
   */
  dips: {
    slug: "dips",
    maxIntensity: 0.72,
    fatigueRate: 0.055,
    minIntensity: 0.48,
    sets: 5,
    minReps: 2,
  },

  /**
   * Профиль для приседаний.
   */
  squats: {
    slug: "squats",
    maxIntensity: 0.7,
    fatigueRate: 0.04,
    minIntensity: 0.5,
    sets: 5,
    minReps: 5,
  },
};
