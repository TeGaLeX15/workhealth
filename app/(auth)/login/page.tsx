// app/(auth)/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthBrand from "@/app/components/auth/AuthBrand";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthFooter from "@/app/components/auth/AuthFooter";
import AuthInput from "@/app/components/auth/AuthInput";
import PasswordInput from "@/app/components/auth/PasswordInput";

import { useAsyncSubmit } from "@/app/lib/hooks/useAsyncSubmit";
import { login } from "@/app/lib/auth/login";
import {
  getClientTimezone,
  setStoredTimezone,
} from "@/app/lib/timezone/client";
import { loginSchema } from "@/app/lib/validation/auth";

/**
 * Страница входа в аккаунт Body OS.
 *
 * Отвечает за:
 * - ввод и валидацию учетных данных;
 * - отображение ошибок полей и запроса;
 * - определение часового пояса пользователя;
 * - выполнение авторизации;
 * - сохранение часового пояса после успешного входа;
 * - перенаправление пользователя на главную страницу.
 */
export default function LoginPage() {
  /* ==========================================================================
     ROUTER
     ========================================================================== */

  const router = useRouter();

  /* ==========================================================================
     FORM STATE
     ========================================================================== */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  /* ==========================================================================
     SUBMISSION STATE
     ========================================================================== */

  /**
   * Управляет состоянием асинхронной отправки формы:
   * загрузкой, завершением и серверной ошибкой.
   */
  const { isLoading, isCompleted, error, execute, clearError } =
    useAsyncSubmit();

  /* ==========================================================================
     VALIDATION
     ========================================================================== */

  /**
   * Валидирует текущие значения формы через общую схему авторизации.
   *
   * Результат используется как для отображения ошибок отдельных полей,
   * так и для определения доступности кнопки отправки.
   */
  const validationResult = loginSchema.safeParse({
    email,
    password,
  });

  const fieldErrors = validationResult.success
    ? {}
    : validationResult.error.flatten().fieldErrors;

  const emailError = fieldErrors.email?.[0] ?? "";
  const passwordError = fieldErrors.password?.[0] ?? "";

  const isFormValid = validationResult.success;

  /* ==========================================================================
     SUBMIT
     ========================================================================== */

  /**
   * Выполняет авторизацию пользователя.
   *
   * Перед отправкой повторно валидирует форму, получает локальный часовой пояс
   * и передаёт данные в auth-слой. После успешного входа сохраняет часовой пояс
   * и перенаправляет пользователя на главную страницу.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    const validation = loginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      return;
    }

    const timezone = getClientTimezone();

    const result = await execute((signal) =>
      login(
        {
          email: validation.data.email,
          password: validation.data.password,
          timezone,
        },
        signal,
      ),
    );

    if (result === null) {
      return;
    }

    setStoredTimezone(timezone);

    await router.replace("/");
  }

  return (
    <>
      {/* BRAND */}
      <AuthBrand />

      {/* LOGIN FORM */}
      <AuthCard
        title="С возвращением"
        description="Войди в аккаунт, чтобы продолжить тренировку и следить за своим прогрессом."
        footer={
          <div className="mt-5 flex items-center justify-center">
            <span
              className="text-[13px]"
              style={{
                color: "var(--muted)",
              }}
            >
              Нет аккаунта?
            </span>

            <Link
              href="/register"
              className="
                ml-1
                flex
                min-h-10
                items-center
                rounded-xl
                px-2
                text-[13px]
                font-semibold
                transition
                hover:opacity-70
              "
              style={{
                color: "var(--accent)",
              }}
            >
              Создать
            </Link>
          </div>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* EMAIL */}
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
            disabled={isLoading || isCompleted}
            required
            touched={emailTouched}
            error={emailError}
          />

          {/* PASSWORD */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span
                className="block text-[13px] font-semibold"
                style={{
                  color: "var(--foreground)",
                }}
              >
                Пароль
              </span>

              <Link
                href="/forgot-password"
                className="
                  -my-2
                  flex
                  min-h-10
                  items-center
                  rounded-xl
                  px-2
                  text-[12px]
                  font-semibold
                  transition
                  hover:opacity-70
                "
                style={{
                  color: "var(--accent)",
                }}
              >
                Забыли пароль?
              </Link>
            </div>

            <PasswordInput
              id="password"
              label=""
              value={password}
              onChange={(value) => {
                setPassword(value);
                clearError();
              }}
              onBlur={() => setPasswordTouched(true)}
              placeholder="Введите пароль"
              autoComplete="current-password"
              disabled={isLoading || isCompleted}
              required
              touched={passwordTouched}
              error={passwordError}
            />
          </div>

          {/* SERVER ERROR */}
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
                backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
                borderColor: "color-mix(in srgb, #ef4444 18%, transparent)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading || isCompleted}
            aria-disabled={!isFormValid || isLoading || isCompleted}
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
            {isLoading ? "Входим..." : isCompleted ? "Готово" : "Войти"}
          </button>
        </form>
      </AuthCard>

      {/* FOOTER */}
      <AuthFooter />
    </>
  );
}
