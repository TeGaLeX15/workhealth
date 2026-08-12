// app/lib/timezone/local-date.ts

/**
 * Returns the current calendar date
 * in the user's timezone.
 *
 * Used to determine:
 * "What day is it for the user?"
 */
export function getLocalDateString(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

/**
 * Converts a YYYY-MM-DD calendar date
 * to a UTC-midnight Date.
 *
 * Used for storing @db.Date values
 * and comparing calendar dates.
 */
export function dateStringToUtcDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/**
 * Returns a YYYY-MM-DD string directly
 * from a Date representing a Prisma @db.Date column.
 *
 * IMPORTANT:
 * The user's timezone is NOT used here.
 *
 * @db.Date represents a calendar date:
 * 2026-08-10 means exactly August 10.
 */
export function getDateColumnString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
