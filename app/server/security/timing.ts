// app/server/security/timing.ts
export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
