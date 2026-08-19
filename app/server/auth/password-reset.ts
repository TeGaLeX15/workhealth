// app/server/auth/password-reset.ts
import { createHash, randomBytes } from "crypto";

const PASSWORD_RESET_DURATION = 1000 * 60 * 30;

/**
 * Генерирует токен для восстановления пароля и его хеш.
 *
 * Сам токен используется для формирования ссылки,
 * а его хеш сохраняется в базе данных.
 *
 * @returns Токен и его SHA-256 хеш.
 */
export function generatePasswordResetToken() {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256").update(token).digest("hex");

  return {
    token,
    tokenHash,
  };
}

/**
 * Возвращает дату окончания действия токена
 * для восстановления пароля.
 *
 * @returns Дата, после которой токен считается недействительным.
 */
export function getPasswordResetExpiration() {
  return new Date(Date.now() + PASSWORD_RESET_DURATION);
}

/**
 * Хеширует токен восстановления пароля с помощью SHA-256.
 *
 * Используется для безопасного сравнения токена
 * с его значением, сохранённым в базе данных.
 *
 * @param token Токен восстановления пароля.
 * @returns SHA-256 хеш токена.
 */
export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
