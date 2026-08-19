// app/lib/training/types.ts

/**
 * Поддерживаемые упражнения.
 */
export type ExerciseSlug = "pull-ups" | "push-ups" | "dips" | "squats";

/**
 * Профиль генерации тренировок для упражнения.
 */
export interface ExerciseProfile {
  slug: ExerciseSlug;

  /**
   * Интенсивность первого подхода
   * относительно максимального количества повторений.
   *
   * Например, 0.75 означает 75% от maxReps.
   */
  maxIntensity: number;

  /**
   * Коэффициент снижения интенсивности
   * после каждого следующего подхода.
   */
  fatigueRate: number;

  /**
   * Минимально допустимая интенсивность.
   */
  minIntensity: number;

  /**
   * Количество подходов в тренировке.
   */
  sets: number;

  /**
   * Минимальное количество повторений
   * в одном подходе.
   */
  minReps: number;
}

/**
 * Один подход тренировки.
 */
export interface WorkoutSet {
  /** Порядковый номер подхода. */
  setNumber: number;

  /** Целевое количество повторений. */
  targetReps: number;
}

/**
 * Сгенерированная тренировка.
 */
export interface Workout {
  /** Упражнение тренировки. */
  exercise: ExerciseSlug;

  /** Максимальное количество повторений пользователя. */
  maxReps: number;

  /** Подходы тренировки. */
  sets: WorkoutSet[];
}
