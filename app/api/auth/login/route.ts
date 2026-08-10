// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/server/db";
import { createSession } from "@/app/server/auth/session";

import { loginSchema } from "@/app/lib/validation/auth";

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone,
    }).format();

    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Некорректные данные",
        },
        {
          status: 400,
        },
      );
    }

    const { email, password } = validation.data;

    // ─── Client timezone ─────────────────────────────────────────────

    const clientTimezone =
      typeof body.timezone === "string" && isValidTimeZone(body.timezone)
        ? body.timezone
        : null;

    // ─── User ────────────────────────────────────────────────────────

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Неверный email или пароль",
        },
        {
          status: 401,
        },
      );
    }

    // ─── Password ────────────────────────────────────────────────────

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Неверный email или пароль",
        },
        {
          status: 401,
        },
      );
    }

    // ─── Timezone sync ───────────────────────────────────────────────
    //
    // Если timezone устройства отличается от сохранённого,
    // обновляем timezone пользователя.
    //

    if (clientTimezone && clientTimezone !== user.timezone) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          timezone: clientTimezone,
        },
      });

      user.timezone = clientTimezone;
    }

    console.log("LOGIN TIMEZONE DEBUG", {
      clientTimezone,
      clientTimezoneValid: Boolean(clientTimezone),
      serverNow: new Date().toISOString(),
      userTimezone: user.timezone,
      nodeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // ─── Session ────────────────────────────────────────────────────

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Не удалось войти в аккаунт",
      },
      {
        status: 500,
      },
    );
  }
}
