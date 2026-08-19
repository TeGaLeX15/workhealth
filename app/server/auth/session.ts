// app/server/auth/session.ts
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/app/server/db";

const SESSION_COOKIE = "bodyos_session";
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30;

/**
 * Хеширует токен сессии алгоритмом SHA-256.
 *
 * В базе данных хранится только хеш токена, поэтому исходное значение
 * cookie не используется напрямую при поиске сессии.
 */
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Возвращает текущего авторизованного пользователя.
 *
 * React cache() позволяет переиспользовать результат при повторных
 * вызовах во время одного серверного рендера.
 *
 * Если cookie отсутствует, сессия не найдена или истекла,
 * возвращает null. Истёкшая сессия удаляется из базы и cookie.
 */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          timezone: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.delete(SESSION_COOKIE);

    return null;
  }

  return session.user;
});

/**
 * Возвращает текущего пользователя и защищает серверный маршрут
 * или страницу от доступа неавторизованных пользователей.
 *
 * Если пользователь не авторизован, выполняет редирект на страницу входа.
 */
export const requireCurrentUser = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});

/**
 * Создаёт новую сессию пользователя и устанавливает
 * защищённую HTTP-only cookie с токеном сессии.
 *
 * В базе данных сохраняется только хеш токена.
 *
 * @param userId — идентификатор пользователя, для которого создаётся сессия.
 */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Завершает текущую пользовательскую сессию.
 *
 * Удаляет сессию из базы данных и очищает session cookie.
 * Если cookie отсутствует, просто очищает её значение.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await prisma.session.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}
