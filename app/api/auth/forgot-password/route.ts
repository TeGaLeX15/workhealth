// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";

import { createPasswordResetRequest } from "@/app/server/auth/password-reset-request";
import { ensureMinimumResponseTime } from "@/app/server/security/timing";

const MINIMUM_RESPONSE_TIME_MS = 1200;
const RESPONSE_JITTER_MS = 300;

/**
 * Обрабатывает запрос на восстановление пароля.
 *
 * Использует минимальное время ответа со случайным отклонением,
 * чтобы затруднить определение существования аккаунта по времени ответа.
 */
export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      await ensureMinimumResponseTime(
        startedAt,
        MINIMUM_RESPONSE_TIME_MS,
        RESPONSE_JITTER_MS,
      );

      return NextResponse.json(
        {
          error: "Введите email",
        },
        {
          status: 400,
        },
      );
    }

    const origin = new URL(request.url).origin;

    await createPasswordResetRequest(email, origin);

    await ensureMinimumResponseTime(
      startedAt,
      MINIMUM_RESPONSE_TIME_MS,
      RESPONSE_JITTER_MS,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[forgot-password]", error);

    await ensureMinimumResponseTime(
      startedAt,
      MINIMUM_RESPONSE_TIME_MS,
      RESPONSE_JITTER_MS,
    );

    return NextResponse.json(
      {
        error: "Не удалось обработать запрос",
      },
      {
        status: 500,
      },
    );
  }
}
