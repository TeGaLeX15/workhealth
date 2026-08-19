// app/server/email/password-reset.ts
import { Resend } from "resend";

import PasswordResetEmail from "@/app/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

/**
 * Отправляет пользователю письмо со ссылкой для восстановления пароля.
 *
 * @param to email получателя.
 * @param resetUrl одноразовая ссылка для установки нового пароля.
 *
 * @throws {Error} Если сервис отправки письма вернул ошибку.
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Восстановление пароля — Body OS",
    react: PasswordResetEmail({
      resetUrl,
    }),
  });

  if (error) {
    console.error("[send-password-reset-email]", error);
    throw new Error("Не удалось отправить письмо");
  }
}
