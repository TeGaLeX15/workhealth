// app/components/training/utils.ts
import type { Workout, WorkoutSet, WorkoutStatus } from "./types";

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

export function formatDateRange(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(startDate)} — ${formatter.format(endDate)}`;
}

export function formatWorkoutDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return formatter.format(date).replace(/\.$/, "");
}

export function getTotalReps(sets: WorkoutSet[]) {
  return sets.reduce((total, set) => total + set.targetReps, 0);
}

export function getCompletedSets(sets: WorkoutSet[]) {
  return sets.filter((set) => set.completed).length;
}

export function getWorkoutProgress(sets: WorkoutSet[]) {
  if (sets.length === 0) {
    return 0;
  }

  const completedSets = getCompletedSets(sets);

  return Math.round((completedSets / sets.length) * 100);
}

export function getWorkoutSetLabel(count: number) {
  if (count === 1) {
    return "подход";
  }

  if (count >= 2 && count <= 4) {
    return "подхода";
  }

  return "подходов";
}

export function getWorkoutLabel(count: number) {
  if (count === 1) {
    return "тренировка";
  }

  if (count >= 2 && count <= 4) {
    return "тренировки";
  }

  return "тренировок";
}

export function getCurrentSetIndex(workout: Workout) {
  return workout.sets.findIndex((set) => !set.completed);
}
