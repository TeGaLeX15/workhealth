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

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token: rawToken } = await searchParams;

  const token = typeof rawToken === "string" ? rawToken.trim() : "";

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
