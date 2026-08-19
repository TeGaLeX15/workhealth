// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/app/server/db";
import { hashPassword } from "@/app/server/auth/password";
import { hashPasswordResetToken } from "@/app/server/auth/password-reset";

/**
 * Устанавливает новый пароль по действующему токену восстановления.
 *
 * После успешной смены пароля токен помечается использованным,
 * все активные сессии пользователя завершаются, а остальные
 * неиспользованные токены восстановления становятся недействительными.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = typeof body.token === "string" ? body.token.trim() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Недостаточно данных",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Пароль должен содержать минимум 8 символов",
        },
        {
          status: 400,
        },
      );
    }

    const tokenHash = hashPasswordResetToken(token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        {
          error: "Ссылка недействительна или устарела",
        },
        {
          status: 400,
        },
      );
    }

    if (resetToken.usedAt !== null) {
      return NextResponse.json(
        {
          error: "Ссылка уже была использована",
        },
        {
          status: 400,
        },
      );
    }

    if (resetToken.expiresAt <= new Date()) {
      return NextResponse.json(
        {
          error: "Ссылка недействительна или устарела",
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    await prisma.$transaction(
      async (tx) => {
        const currentToken = await tx.passwordResetToken.findUnique({
          where: {
            id: resetToken.id,
          },
          select: {
            userId: true,
            expiresAt: true,
            usedAt: true,
          },
        });

        if (!currentToken) {
          throw new Error("RESET_TOKEN_INVALID");
        }

        if (currentToken.usedAt !== null) {
          throw new Error("RESET_TOKEN_USED");
        }

        if (currentToken.expiresAt <= now) {
          throw new Error("RESET_TOKEN_EXPIRED");
        }

        await tx.user.update({
          where: {
            id: currentToken.userId,
          },
          data: {
            passwordHash,
          },
        });

        await tx.passwordResetToken.update({
          where: {
            id: resetToken.id,
          },
          data: {
            usedAt: now,
          },
        });

        await tx.session.deleteMany({
          where: {
            userId: currentToken.userId,
          },
        });

        await tx.passwordResetToken.updateMany({
          where: {
            userId: currentToken.userId,
            id: {
              not: resetToken.id,
            },
            usedAt: null,
          },
          data: {
            usedAt: now,
          },
        });
      },
      {
        timeout: 10_000,
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "RESET_TOKEN_INVALID") {
        return NextResponse.json(
          {
            error: "Ссылка недействительна или устарела",
          },
          {
            status: 400,
          },
        );
      }

      if (error.message === "RESET_TOKEN_USED") {
        return NextResponse.json(
          {
            error: "Ссылка уже была использована",
          },
          {
            status: 400,
          },
        );
      }

      if (error.message === "RESET_TOKEN_EXPIRED") {
        return NextResponse.json(
          {
            error: "Ссылка недействительна или устарела",
          },
          {
            status: 400,
          },
        );
      }
    }

    console.error("[reset-password]", error);

    return NextResponse.json(
      {
        error: "Не удалось изменить пароль",
      },
      {
        status: 500,
      },
    );
  }
}
