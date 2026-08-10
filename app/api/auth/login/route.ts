// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/server/db";
import { createSession } from "@/app/server/auth/session";

import { loginSchema } from "@/app/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Некорректные данные",
        },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

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
        { status: 401 },
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Неверный email или пароль",
        },
        { status: 401 },
      );
    }

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
      { status: 500 },
    );
  }
}
