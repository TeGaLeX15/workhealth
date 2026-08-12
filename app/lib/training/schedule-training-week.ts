// app/lib/training/schedule-training-week.ts
const WORKOUTS_PER_WEEK = 3;
const WORKOUT_INTERVAL_DAYS = 2;

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function getDatePartsInTimeZone(date: Date, timeZone: string): DateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);

  const month = Number(parts.find((part) => part.type === "month")?.value);

  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(`Failed to determine the date in timezone "${timeZone}"`);
  }

  return {
    year,
    month,
    day,
  };
}

function dateFromParts(parts: DateParts): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);

  result.setUTCDate(result.getUTCDate() + days);

  return result;
}

export function getTrainingWeekSchedule(
  now = new Date(),
  timeZone = "Asia/Almaty",
) {
  const localDateParts = getDatePartsInTimeZone(now, timeZone);

  const today = dateFromParts(localDateParts);

  /**
   * A new training program always starts today.
   *
   * For example, if the user creates a program
   * on Tuesday:
   *
   * Tue — workout #1
   * Wed — rest
   * Thu — workout #2
   * Fri — rest
   * Sat — workout #3
   * Sun — rest
   *
   * The program week still spans
   * a full 7 calendar days:
   * Tue → Mon.
   */

  const startDate = today;

  const scheduledDates = Array.from({ length: WORKOUTS_PER_WEEK }, (_, index) =>
    addDays(startDate, index * WORKOUT_INTERVAL_DAYS),
  );

  const endDate = addDays(startDate, 6);

  return {
    startDate,
    endDate,
    scheduledDates,
    today,
    timeZone,
  };
}
