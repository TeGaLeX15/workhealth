export type ExerciseSlug =
  | "pull-ups"
  | "push-ups"
  | "dips"
  | "squats";

export interface ExerciseProfile {
  slug: ExerciseSlug;

  /**
   * Интенсивность первого подхода относительно максимума.
   * Например 0.75 = 75% от maxReps.
   */
  maxIntensity: number;

  /**
   * Насколько снижается интенсивность
   * после каждого следующего подхода.
   */
  fatigueRate: number;

  /**
   * Минимальная допустимая интенсивность.
   */
  minIntensity: number;

  /**
   * Количество подходов в тренировке.
   */
  sets: number;

  /**
   * Минимальное количество повторений.
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