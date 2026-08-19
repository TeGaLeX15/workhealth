// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/app/server/db";
import { hashPassword } from "@/app/server/auth/password";
import { hashPasswordResetToken } from "@/app/server/auth/password-reset";

/**
 * Коды ошибок, возникающие при попытке использовать
 * недействительный, просроченный или уже использованный
 * токен восстановления пароля.
 */
type ResetPasswordErrorCode =
  "RESET_TOKEN_INVALID" | "RESET_TOKEN_USED" | "RESET_TOKEN_EXPIRED";

/**
 * Устанавливает новый пароль по действующему токену восстановления.
 *
 * Перед изменением пароля проверяет существование, срок действия
 * и состояние токена.
 *
 * После успешной смены пароля:
 * - текущий токен помечается использованным;
 * - пароль пользователя обновляется;
 * - все активные сессии пользователя завершаются;
 * - остальные неиспользованные токены восстановления
 *   становятся недействительными.
 *
 * Операции изменения состояния пользователя выполняются
 * внутри одной транзакции, чтобы они либо завершились полностью,
 * либо были полностью отменены.
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

    /**
     * Хешируем токен до обращения к базе данных.
     *
     * В базе хранится только хеш токена, а не его исходное значение.
     */
    const tokenHash = hashPasswordResetToken(token);

    /**
     * Находим токен и получаем только необходимые данные.
     */
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

    const now = new Date();

    if (resetToken.expiresAt <= now) {
      return NextResponse.json(
        {
          error: "Ссылка недействительна или устарела",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Хеширование пароля выполняется до открытия транзакции.
     *
     * Это важно: ресурсы соединения с базой данных не должны
     * удерживаться во время CPU-затратной операции хеширования.
     */
    const passwordHash = await hashPassword(password);

    await prisma.$transaction(
      async (tx) => {
        /**
         * Атомарно помечаем токен использованным.
         *
         * Условия usedAt и expiresAt защищают от ситуации,
         * когда два запроса одновременно пытаются использовать
         * один и тот же токен.
         *
         * Только один из них сможет изменить строку.
         */
        const claimedToken = await tx.passwordResetToken.updateMany({
          where: {
            id: resetToken.id,
            userId: resetToken.userId,
            usedAt: null,
            expiresAt: {
              gt: now,
            },
          },
          data: {
            usedAt: now,
          },
        });

        if (claimedToken.count !== 1) {
          /**
           * Если строка не была обновлена, токен уже был
           * использован, истёк или больше не существует.
           *
           * Для пользователя все эти ситуации выглядят одинаково:
           * ссылка больше недействительна.
           */
          throw new Error("RESET_TOKEN_INVALID");
        }

        /**
         * Устанавливаем новый пароль пользователя.
         */
        await tx.user.update({
          where: {
            id: resetToken.userId,
          },
          data: {
            passwordHash,
          },
        });

        /**
         * Завершаем все существующие сессии пользователя.
         *
         * Это гарантирует, что после смены пароля старые
         * авторизованные сессии больше не останутся активными.
         */
        await tx.session.deleteMany({
          where: {
            userId: resetToken.userId,
          },
        });

        /**
         * Делаем остальные токены восстановления
         * недействительными.
         *
         * Это предотвращает использование старых писем
         * после успешной смены пароля.
         */
        await tx.passwordResetToken.updateMany({
          where: {
            userId: resetToken.userId,
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
        /**
         * Транзакция содержит только быстрые операции с БД:
         * хеширование пароля выполняется до её открытия.
         */
        timeout: 10_000,
      },
    );

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = error.message as ResetPasswordErrorCode;

      if (errorCode === "RESET_TOKEN_INVALID") {
        return NextResponse.json(
          {
            error: "Ссылка недействительна или устарела",
          },
          {
            status: 400,
          },
        );
      }

      if (errorCode === "RESET_TOKEN_USED") {
        return NextResponse.json(
          {
            error: "Ссылка уже была использована",
          },
          {
            status: 400,
          },
        );
      }

      if (errorCode === "RESET_TOKEN_EXPIRED") {
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
