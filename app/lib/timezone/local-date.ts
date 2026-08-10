// app/lib/timezone/local-date.ts
/**
 * Возвращает текущую календарную дату
 * в timezone пользователя.
 *
 * Используется для определения:
 * "Какой сегодня день у пользователя?"
 */
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

/**
 * Преобразует календарную дату YYYY-MM-DD
 * в UTC-midnight Date.
 *
 * Используется для хранения @db.Date
 * и сравнений календарных дат.
 */
export function dateStringToUtcDate(
  dateString: string,
): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/**
 * Получает YYYY-MM-DD непосредственно
 * из Date, который представляет колонку
 * Prisma @db.Date.
 *
 * ВАЖНО:
 * Здесь timezone пользователя НЕ используется.
 *
 * @db.Date — это календарная дата:
 * 2026-08-10 означает именно 10 августа.
 */
export function getDateColumnString(
  date: Date,
): string {
  const year = date.getUTCFullYear();
  const month = String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getUTCDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}