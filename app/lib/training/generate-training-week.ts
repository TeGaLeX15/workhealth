// app/lib/training/generate-training-week.ts
import { generateWorkout } from "./generate-workout";
import { getTrainingWeekSchedule } from "./schedule-training-week";

import type { ExerciseSlug } from "./types";

/**
 * Генерирует полную тренировочную неделю
 * для указанного упражнения.
 *
 * Расписание формируется с учётом часового пояса пользователя,
 * а каждая тренировка получает одинаковую структуру подходов,
 * рассчитанную на основе максимального количества повторений.
 *
 * @param exercise Идентификатор упражнения.
 * @param maxReps Максимальное количество повторений пользователя.
 * @param now Текущий момент времени.
 * @param timeZone Часовой пояс пользователя.
 * @returns Сгенерированная тренировочная неделя
 *          с датами тренировок и подходами.
 */
export function generateTrainingWeek(
  exercise: ExerciseSlug,
  maxReps: number,
  now = new Date(),
  timeZone = "Asia/Almaty",
) {
  const schedule = getTrainingWeekSchedule(now, timeZone);

  const workouts = schedule.scheduledDates.map((scheduledDate, index) => ({
    /** Порядковый номер тренировки в неделе. */
    workoutNumber: index + 1,

    /** Запланированная календарная дата тренировки. */
    scheduledDate,

    /** Подходы, рассчитанные для упражнения и текущего максимума. */
    sets: generateWorkout(exercise, maxReps).sets,
  }));

  return {
    /** Максимальное количество повторений, использованное при генерации. */
    maxReps,

    /** Дата начала тренировочной недели. */
    startDate: schedule.startDate,

    /** Дата окончания тренировочной недели. */
    endDate: schedule.endDate,

    /** Тренировки, входящие в неделю. */
    workouts,
  };
}
