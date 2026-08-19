// app/server/security/timing.ts

/**
 * Приостанавливает выполнение на указанное количество миллисекунд.
 */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Возвращает случайное целое число в диапазоне от min до max включительно.
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Гарантирует минимальную длительность выполнения операции.
 *
 * При необходимости добавляет случайную задержку, чтобы итоговое время
 * ответа находилось в диапазоне от minimumMs до minimumMs + jitterMs.
 */
export async function ensureMinimumResponseTime(
  startedAt: number,
  minimumMs: number,
  jitterMs = 0,
) {
  const target = minimumMs + randomInt(0, jitterMs);
  const elapsed = Date.now() - startedAt;
  const remaining = target - elapsed;

  if (remaining > 0) {
    await sleep(remaining);
  }
}
