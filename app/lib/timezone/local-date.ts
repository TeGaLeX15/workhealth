// app/lib/timezone/local-date.ts
export function getLocalDateString(
  date: Date,
  timeZone: string,
): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function dateStringToUtcDate(
  dateString: string,
): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}