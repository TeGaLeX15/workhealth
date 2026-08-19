// app/components/training/utils.ts
import type { Workout, WorkoutSet, WorkoutStatus } from "./types";

/**
 * Возвращает текстовую метку статуса тренировки.
 *
 * @param status - Статус тренировки.
 * @returns Локализованное название статуса.
 */
export function getStatusLabel(status: WorkoutStatus) {
  switch (status) {
    case "PLANNED":
      return "Запланирована";

    case "IN_PROGRESS":
      return "В процессе";

    case "COMPLETED":
      return "Выполнена";

    case "CANCELLED":
      return "Отменена";

    case "SKIPPED":
      return "Пропущена";
  }
}

/**
 * Возвращает стили для отображения статуса тренировки.
 *
 * @param status - Статус тренировки.
 * @returns Объект CSS-стилей для бейджа статуса.
 */
export function getStatusStyle(status: WorkoutStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 12%, var(--surface))",
        color: "var(--accent)",
      };

    case "COMPLETED":
      return {
        backgroundColor:
          "color-mix(in srgb, var(--accent) 10%, var(--surface))",
        color: "var(--accent)",
      };

    case "CANCELLED":
      return {
        backgroundColor: "color-mix(in srgb, #ef4444 8%, var(--surface))",
        color: "#ef4444",
      };

    case "SKIPPED":
      return {
        backgroundColor: "color-mix(in srgb, var(--muted) 8%, var(--surface))",
        color: "var(--muted)",
      };

    case "PLANNED":
    default:
      return {
        backgroundColor: "color-mix(in srgb, var(--muted) 8%, var(--surface))",
        color: "var(--muted)",
      };
  }
}

/**
 * Возвращает стили карточки тренировки в зависимости от её статуса.
 *
 * @param status - Статус тренировки.
 * @returns Объект CSS-стилей для карточки.
 */
export function getWorkoutCardStyle(status: WorkoutStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return {
        backgroundColor: "color-mix(in srgb, var(--accent) 3%, var(--card))",
        borderColor: "color-mix(in srgb, var(--accent) 35%, var(--border))",
        boxShadow:
          "0 8px 28px color-mix(in srgb, var(--accent) 7%, transparent)",
      };

    case "COMPLETED":
      return {
        backgroundColor: "var(--card)",
        borderColor: "color-mix(in srgb, var(--accent) 16%, var(--border))",
      };

    case "CANCELLED":
      return {
        backgroundColor: "color-mix(in srgb, #ef4444 1%, var(--card))",
        borderColor: "color-mix(in srgb, #ef4444 16%, var(--border))",
      };

    case "PLANNED":
    case "SKIPPED":
    default:
      return {
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      };
  }
}

/**
 * Форматирует диапазон дат тренировки.
 *
 * @param startDate - Дата начала периода.
 * @param endDate - Дата окончания периода.
 * @returns Диапазон дат в русском формате.
 */
export function formatDateRange(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(startDate)} — ${formatter.format(endDate)}`;
}

/**
 * Форматирует дату тренировки для компактного отображения.
 *
 * @param date - Дата тренировки.
 * @returns Отформатированная дата с сокращёнными днём недели и месяцем.
 */
export function formatWorkoutDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return formatter.format(date).replace(/\.$/, "");
}

/**
 * Вычисляет общее количество целевых повторений во всех подходах.
 *
 * @param sets - Список подходов тренировки.
 * @returns Общее количество повторений.
 */
export function getTotalReps(sets: WorkoutSet[]) {
  return sets.reduce((total, set) => total + set.targetReps, 0);
}

/**
 * Подсчитывает количество выполненных подходов.
 *
 * @param sets - Список подходов тренировки.
 * @returns Количество выполненных подходов.
 */
export function getCompletedSets(sets: WorkoutSet[]) {
  return sets.filter((set) => set.completed).length;
}

/**
 * Вычисляет процент выполнения тренировки по завершённым подходам.
 *
 * @param sets - Список подходов тренировки.
 * @returns Процент выполнения от 0 до 100.
 */
export function getWorkoutProgress(sets: WorkoutSet[]) {
  if (sets.length === 0) {
    return 0;
  }

  const completedSets = getCompletedSets(sets);

  return Math.round((completedSets / sets.length) * 100);
}

/**
 * Возвращает правильную форму слова «подход» для указанного количества.
 *
 * @param count - Количество подходов.
 * @returns Склонённая форма слова «подход».
 */
export function getWorkoutSetLabel(count: number) {
  if (count === 1) {
    return "подход";
  }

  if (count >= 2 && count <= 4) {
    return "подхода";
  }

  return "подходов";
}

/**
 * Возвращает правильную форму слова «тренировка» для указанного количества.
 *
 * @param count - Количество тренировок.
 * @returns Склонённая форма слова «тренировка».
 */
export function getWorkoutLabel(count: number) {
  if (count === 1) {
    return "тренировка";
  }

  if (count >= 2 && count <= 4) {
    return "тренировки";
  }

  return "тренировок";
}

/**
 * Находит индекс текущего незавершённого подхода.
 *
 * @param workout - Тренировка с набором подходов.
 * @returns Индекс первого незавершённого подхода или `-1`, если все подходы выполнены.
 */
export function getCurrentSetIndex(workout: Workout) {
  return workout.sets.findIndex((set) => !set.completed);
}
