// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/server/db";
import { createSession } from "@/app/server/auth/session";

import { registerRequestSchema } from "@/app/lib/validation/auth";

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

    const validation = registerRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Некорректные данные",
        },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    const timezone =
      typeof body.timezone === "string" && isValidTimeZone(body.timezone)
        ? body.timezone
        : "Asia/Almaty";

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Пользователь с таким email уже существует",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        timezone,
      },
      select: {
        id: true,
        email: true,
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: "Не удалось создать аккаунт",
      },
      { status: 500 },
    );
  }
}
