// app/server/auth/password.ts
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import bcrypt from "bcryptjs";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * Хеширует пароль с использованием scrypt.
 *
 * Результат содержит соль и производный ключ,
 * разделённые двоеточием:
 *
 * `salt:derivedKey`
 *
 * @param password Пароль в открытом виде.
 * @returns Хеш пароля с солью и производным ключом.
 */
export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH);

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

/**
 * Проверяет пароль относительно сохранённого хеша.
 *
 * Сначала проверяется актуальный формат scrypt.
 * Если хеш не соответствует формату scrypt,
 * используется bcrypt для обратной совместимости
 * с существующими аккаунтами.
 *
 * @param password Пароль в открытом виде.
 * @param passwordHash Сохранённый хеш пароля.
 * @returns `true`, если пароль совпадает с хешем, иначе `false`.
 */
export async function verifyPassword(password: string, passwordHash: string) {
  /*
   * Текущий формат scrypt:
   *
   * salt:derivedKey
   */
  if (passwordHash.includes(":")) {
    const [saltHex, keyHex] = passwordHash.split(":");

    if (!saltHex || !keyHex) {
      return false;
    }

    try {
      const salt = Buffer.from(saltHex, "hex");
      const storedKey = Buffer.from(keyHex, "hex");

      const derivedKey = (await scryptAsync(
        password,
        salt,
        storedKey.length,
      )) as Buffer;

      if (derivedKey.length !== storedKey.length) {
        return false;
      }

      return timingSafeEqual(derivedKey, storedKey);
    } catch {
      return false;
    }
  }

  /*
   * Старый формат bcrypt.
   *
   * Оставлен только для обратной совместимости
   * и миграции существующих аккаунтов.
   */
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}
