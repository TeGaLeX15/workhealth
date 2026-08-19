// app/(auth)/reset-password/page.tsx
import Link from "next/link";

import { prisma } from "@/app/server/db";
import { hashPasswordResetToken } from "@/app/server/auth/password-reset";

import AuthBrand from "@/app/components/auth/AuthBrand";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthFooter from "@/app/components/auth/AuthFooter";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

/**
 * Страница восстановления пароля по токену.
 *
 * Получает токен из URL, проверяет его существование,
 * срок действия и факт использования.
 *
 * Если токен недействителен, пользователь получает сообщение
 * с возможностью запросить новую ссылку.
 *
 * При валидном токене отображается форма установки нового пароля.
 */
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  /* ==========================================================================
     TOKEN
     ========================================================================== */

  /**
   * Получает и нормализует токен восстановления из URL.
   */
  const { token: rawToken } = await searchParams;

  const token = typeof rawToken === "string" ? rawToken.trim() : "";

  /* ==========================================================================
     TOKEN VALIDATION
     ========================================================================== */

  /**
   * Если токен отсутствует, восстановление пароля невозможно.
   */
  if (!token) {
    return (
      <>
        <AuthBrand />

        <AuthCard
          title="Ссылка недействительна"
          description="Не удалось найти токен восстановления пароля."
          footer={
            <div className="mt-5 flex justify-center">
              <Link
                href="/forgot-password"
                className="
                  flex
                  min-h-10
                  items-center
                  rounded-xl
                  px-3
                  text-[13px]
                  font-semibold
                  transition
                  hover:opacity-70
                "
                style={{
                  color: "var(--accent)",
                }}
              >
                Запросить новую ссылку
              </Link>
            </div>
          }
        >
          <div
            className="
              rounded-[16px]
              border
              px-4
              py-4
              text-center
              text-[13px]
              leading-5
            "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 18%, var(--border))",
              color: "var(--foreground)",
            }}
          >
            Открой ссылку из письма для восстановления пароля.
          </div>
        </AuthCard>

        <AuthFooter />
      </>
    );
  }

  /* ==========================================================================
     RESET TOKEN LOOKUP
     ========================================================================== */

  /**
   * Хеширует токен перед поиском в базе данных.
   *
   * В базе хранится только хеш токена, поэтому исходное значение
   * не используется непосредственно в запросе.
   */
  const tokenHash = hashPasswordResetToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,
      usedAt: true,
    },
  });

  /* ==========================================================================
     TOKEN STATUS
     ========================================================================== */

  /**
   * Проверяет, можно ли использовать найденный токен.
   *
   * Токен считается недействительным, если:
   * - он не найден;
   * - уже был использован;
   * - срок его действия истёк.
   */
  const isInvalid =
    !resetToken ||
    resetToken.usedAt !== null ||
    resetToken.expiresAt <= new Date();

  if (isInvalid) {
    return (
      <>
        <AuthBrand />

        <AuthCard
          title="Ссылка недействительна"
          description="Эта ссылка для восстановления пароля больше не может быть использована."
          footer={
            <div className="mt-5 flex justify-center">
              <Link
                href="/forgot-password"
                className="
                  flex
                  min-h-10
                  items-center
                  rounded-xl
                  px-3
                  text-[13px]
                  font-semibold
                  transition
                  hover:opacity-70
                "
                style={{
                  color: "var(--accent)",
                }}
              >
                Запросить новую ссылку
              </Link>
            </div>
          }
        >
          <div
            className="
              rounded-[16px]
              border
              px-4
              py-4
              text-center
              text-[13px]
              leading-5
            "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 18%, var(--border))",
              color: "var(--foreground)",
            }}
          >
            Ссылка уже использована или срок её действия истёк.
          </div>
        </AuthCard>

        <AuthFooter />
      </>
    );
  }

  /* ==========================================================================
     RESET FORM
     ========================================================================== */

  /**
   * Для валидного токена отображается форма установки нового пароля.
   */
  return (
    <>
      <AuthBrand />

      <AuthCard
        title="Новый пароль"
        description="Придумай новый пароль для своего аккаунта."
      >
        <ResetPasswordForm token={token} />
      </AuthCard>

      <AuthFooter />
    </>
  );
}
