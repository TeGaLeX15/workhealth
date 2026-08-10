// app/lib/training/generate-training-week.ts
import { generateWorkout } from "./generate-workout";
import { getTrainingWeekSchedule } from "./schedule-training-week";

import type { ExerciseSlug } from "./types";

export function generateTrainingWeek(
  exercise: ExerciseSlug,
  maxReps: number,
  now = new Date(),
  timeZone = "Asia/Almaty",
) {
  const schedule = getTrainingWeekSchedule(now, timeZone);

  const workouts = schedule.scheduledDates.map((scheduledDate, index) => ({
    workoutNumber: index + 1,

    scheduledDate,

    sets: generateWorkout(exercise, maxReps).sets,
  }));

  return {
    maxReps,

    startDate: schedule.startDate,

    endDate: schedule.endDate,

    workouts,
  };
}
