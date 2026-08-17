// app/server/auth/password-reset.ts
import { createHash, randomBytes } from "crypto";

const PASSWORD_RESET_DURATION = 1000 * 60 * 30;

export function generatePasswordResetToken() {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256").update(token).digest("hex");

  return {
    token,
    tokenHash,
  };
}

export function getPasswordResetExpiration() {
  return new Date(Date.now() + PASSWORD_RESET_DURATION);
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
