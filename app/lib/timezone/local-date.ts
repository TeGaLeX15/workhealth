// app/lib/timezone/local-date.ts

/**
 * Возвращает текущую календарную дату
 * в часовом поясе пользователя в формате YYYY-MM-DD.
 *
 * @param date Дата, относительно которой определяется календарный день.
 * @param timeZone Часовой пояс пользователя в формате IANA.
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
 * Преобразует календарную дату в формате YYYY-MM-DD
 * в Date, соответствующий полуночи по UTC.
 *
 * Используется для хранения и сравнения значений Prisma @db.Date.
 *
 * @param dateString Календарная дата в формате YYYY-MM-DD.
 */
export function dateStringToUtcDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

/**
 * Возвращает календарную дату в формате YYYY-MM-DD
 * из значения Date, представляющего колонку Prisma @db.Date.
 *
 * Часовой пояс пользователя здесь намеренно не используется,
 * поскольку @db.Date хранит календарную дату, а не конкретный момент времени.
 *
 * @param date Значение Date, представляющее календарную дату.
 */
export function getDateColumnString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
