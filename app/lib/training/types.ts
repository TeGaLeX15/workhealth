// app/lib/training/types.ts
export type ExerciseSlug = "pull-ups" | "push-ups" | "dips" | "squats";

export interface ExerciseProfile {
  slug: ExerciseSlug;

  /**
   * Intensity of the first set relative to the user's maximum.
   * For example, 0.75 means 75% of maxReps.
   */
  maxIntensity: number;

  /**
   * How much the intensity decreases
   * after each subsequent set.
   */
  fatigueRate: number;

  /**
   * Minimum allowed intensity.
   */
  minIntensity: number;

  /**
   * Number of sets in the workout.
   */
  sets: number;

  /**
   * Minimum number of repetitions.
   */
  minReps: number;
}

export interface WorkoutSet {
  setNumber: number;
  targetReps: number;
}

export interface Workout {
  exercise: ExerciseSlug;
  maxReps: number;
  sets: WorkoutSet[];
}
