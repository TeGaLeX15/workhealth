import type { ExerciseProfile, ExerciseSlug } from "./types";

export const exerciseProfiles: Record<ExerciseSlug, ExerciseProfile> = {
  "pull-ups": {
    slug: "pull-ups",
    maxIntensity: 0.75,
    fatigueRate: 0.06,
    minIntensity: 0.5,
    sets: 5,
    minReps: 1,
  },

  "push-ups": {
    slug: "push-ups",
    maxIntensity: 0.7,
    fatigueRate: 0.05,
    minIntensity: 0.45,
    sets: 5,
    minReps: 2,
  },

  dips: {
    slug: "dips",
    maxIntensity: 0.72,
    fatigueRate: 0.055,
    minIntensity: 0.48,
    sets: 5,
    minReps: 2,
  },

  squats: {
    slug: "squats",
    maxIntensity: 0.7,
    fatigueRate: 0.04,
    minIntensity: 0.5,
    sets: 5,
    minReps: 5,
  },
};