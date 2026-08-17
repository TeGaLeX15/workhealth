// app/server/auth/password.ts
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import bcrypt from "bcryptjs";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH);

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  /*
   * Новый формат:
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
   * Старый bcrypt-формат.
   *
   * Используется только для миграции
   * существующих аккаунтов.
   */
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}
