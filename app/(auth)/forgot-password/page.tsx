// app/(auth)/forgot-password/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import AuthBrand from "@/app/components/auth/AuthBrand";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthFooter from "@/app/components/auth/AuthFooter";
import AuthInput from "@/app/components/auth/AuthInput";

import { useAsyncSubmit } from "@/app/lib/hooks/useAsyncSubmit";
import { apiClient } from "@/app/lib/api/client";

/**
 * Страница восстановления пароля.
 *
 * Позволяет пользователю указать email и запросить
 * ссылку для восстановления доступа к аккаунту.
 */
export default function ForgotPasswordPage() {
  /* ==========================================================================
     FORM STATE
     ========================================================================== */

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [isSent, setIsSent] = useState(false);

  /* ==========================================================================
     SUBMISSION
     ========================================================================== */

  const { isLoading, error, execute, clearError } = useAsyncSubmit();

  /* ==========================================================================
     VALIDATION
     ========================================================================== */

  /**
   * Определяет, является ли введённый email корректным.
   */
  const isEmailValid =
    email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /**
   * Возвращает ошибку email после взаимодействия пользователя с полем.
   */
  const emailError =
    emailTouched && !isEmailValid ? "Введите корректный email" : "";

  /* ==========================================================================
     ACTIONS
     ========================================================================== */

  /**
   * Отправляет запрос на восстановление пароля.
   *
   * @param event Событие отправки формы.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailTouched(true);

    if (!isEmailValid) {
      return;
    }

    const result = await execute((signal) =>
      apiClient<{ success: boolean }>("/api/auth/forgot-password", {
        method: "POST",
        signal,
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      }),
    );

    if (result === null) {
      return;
    }

    setIsSent(true);
  }

  return (
    <>
      <AuthBrand />

      <AuthCard
        title="Восстановление пароля"
        description={
          isSent
            ? "Если аккаунт с таким email существует, мы отправили инструкции для восстановления пароля."
            : "Введи email, который использовал при регистрации."
        }
        footer={
          <div className="mt-5 flex items-center justify-center">
            <Link
              href="/login"
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
              Вернуться ко входу
            </Link>
          </div>
        }
      >
        {isSent ? (
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
              backgroundColor:
                "color-mix(in srgb, var(--accent) 6%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--accent) 18%, var(--border))",
              color: "var(--foreground)",
            }}
          >
            Проверь свою почту. Если письмо не пришло, проверь папку «Спам».
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                clearError();
              }}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
              touched={emailTouched}
              error={emailError}
            />

            {error && (
              <div
                role="alert"
                className="
                  rounded-[15px]
                  border
                  px-3.5
                  py-3
                  text-[12px]
                  leading-5
                "
                style={{
                  backgroundColor:
                    "color-mix(in srgb, #ef4444 6%, transparent)",
                  borderColor: "color-mix(in srgb, #ef4444 18%, var(--border))",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isEmailValid || isLoading}
              aria-disabled={!isEmailValid || isLoading}
              aria-busy={isLoading}
              className="
                mt-1
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                rounded-[16px]
                text-[15px]
                font-bold
                text-white
                transition
                active:scale-[0.985]
                disabled:cursor-not-allowed
                disabled:opacity-45
                disabled:shadow-none
              "
              style={{
                backgroundColor: "var(--accent)",
                boxShadow:
                  "0 7px 20px color-mix(in srgb, var(--accent) 18%, transparent)",
              }}
            >
              {isLoading ? "Отправляем..." : "Отправить ссылку"}
            </button>
          </form>
        )}
      </AuthCard>

      <AuthFooter />
    </>
  );
}
