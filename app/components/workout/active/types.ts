// app/components/workout/active/types.ts

/**
 * Данные одного подхода активной тренировки.
 */
export type WorkoutSet = {
  /**
   * Уникальный идентификатор подхода.
   */
  id: string;

  /**
   * Порядковый номер подхода в тренировке.
   */
  setNumber: number;

  /**
   * Целевое количество повторений.
   */
  targetReps: number;

  /**
   * Фактически выполненное количество повторений.
   *
   * `null` означает, что подход ещё не был выполнен.
   */
  actualReps: number | null;

  /**
   * Определяет, завершён ли подход.
   */
  completed: boolean;

  /**
   * Дата и время завершения подхода.
   *
   * `null`, если подход ещё не завершён.
   */
  completedAt: Date | null;

  /**
   * Идентификатор тренировки, к которой относится подход.
   */
  workoutId: string;
};

/**
 * Пропсы карточки активной тренировки.
 */
export type ActiveWorkoutCardProps = {
  /**
   * Идентификатор тренировки.
   */
  workoutId: string;

  /**
   * Порядковый номер тренировки.
   */
  workoutNumber: number;

  /**
   * Список подходов текущей тренировки.
   */
  sets: WorkoutSet[];
};
