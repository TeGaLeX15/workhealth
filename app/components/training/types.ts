// app/components/training/types.ts

/**
 * Возможные статусы тренировки.
 */
export type WorkoutStatus =
  "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "SKIPPED";

/**
 * Подход в рамках тренировки.
 */
export type WorkoutSet = {
  /** Уникальный идентификатор подхода. */
  id: string;

  /** Порядковый номер подхода. */
  setNumber: number;

  /** Целевое количество повторений. */
  targetReps: number;

  /** Фактически выполненное количество повторений. */
  actualReps: number | null;

  /** Указывает, выполнен ли подход. */
  completed: boolean;

  /** Дата и время завершения подхода. */
  completedAt: Date | null;

  /** Идентификатор тренировки, к которой относится подход. */
  workoutId: string;
};

/**
 * Тренировка с запланированными и выполненными подходами.
 */
export type Workout = {
  /** Уникальный идентификатор тренировки. */
  id: string;

  /** Порядковый номер тренировки в программе. */
  workoutNumber: number;

  /** Запланированная дата тренировки. */
  scheduledDate: Date;

  /** Текущий статус тренировки. */
  status: WorkoutStatus;

  /** Список подходов тренировки. */
  sets: WorkoutSet[];
};

/**
 * Пропсы карточки тренировочной недели.
 */
export type TrainingWeekCardProps = {
  /** Номер тренировочной недели. */
  weekNumber: number;

  /** Дата начала недели. */
  startDate: Date;

  /** Дата окончания недели. */
  endDate: Date;

  /** Список тренировок недели. */
  workouts: Workout[];

  /** Идентификатор текущей тренировки или `null`, если текущей тренировки нет. */
  currentWorkoutId: string | null;
};
