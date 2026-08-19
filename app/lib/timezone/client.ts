// app/lib/timezone/client.ts
const TIMEZONE_STORAGE_KEY = "bodyos_timezone";

/**
 * Возвращает часовой пояс, определённый браузером пользователя.
 *
 * @returns Часовой пояс в формате IANA.
 */
export function getClientTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Возвращает сохранённый часовой пояс из localStorage.
 *
 * @returns Сохранённый часовой пояс или null, если он отсутствует.
 */
export function getStoredTimezone(): string | null {
  return localStorage.getItem(TIMEZONE_STORAGE_KEY);
}

/**
 * Сохраняет часовой пояс пользователя в localStorage.
 *
 * @param timezone Часовой пояс в формате IANA.
 */
export function setStoredTimezone(timezone: string): void {
  localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
}
