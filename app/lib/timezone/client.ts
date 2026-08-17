// app/lib/timezone/client.ts
const TIMEZONE_STORAGE_KEY = "bodyos_timezone";

export function getClientTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getStoredTimezone(): string | null {
  return localStorage.getItem(TIMEZONE_STORAGE_KEY);
}

export function setStoredTimezone(timezone: string): void {
  localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
}
