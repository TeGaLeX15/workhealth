// app/(auth)/register/page.tsx
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
import { register } from "@/app/lib/auth/register";
import {
  getClientTimezone,
  setStoredTimezone,
} from "@/app/lib/timezone/client";
import { registerSchema } from "@/app/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordRepeatTouched, setPasswordRepeatTouched] = useState(false);

  const { isLoading, isCompleted, error, execute, clearError } =
    useAsyncSubmit();

  const validationResult = registerSchema.safeParse({
    email,
    password,
    passwordRepeat,
  });

  const fieldErrors = validationResult.success
    ? {}
    : validationResult.error.flatten().fieldErrors;

  const emailError = fieldErrors.email?.[0] ?? "";
  const passwordError = fieldErrors.password?.[0] ?? "";
  const passwordRepeatError = fieldErrors.passwordRepeat?.[0] ?? "";

  const isFormValid = validationResult.success;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    const validation = registerSchema.safeParse({
      email,
      password,
      passwordRepeat,
    });

    if (!validation.success) {
      return;
    }

    const timezone = getClientTimezone();

    const result = await execute((signal) =>
      register(
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
      <AuthBrand />

      <AuthCard
        title="Создать аккаунт"
        description="Создай аккаунт, чтобы сохранять тренировки и следить за своим прогрессом."
        footer={
          <div className="mt-5 flex items-center justify-center">
            <span
              className="text-[13px]"
              style={{
                color: "var(--muted)",
              }}
            >
              Уже есть аккаунт?
            </span>

            <Link
              href="/login"
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
              Войти
            </Link>
          </div>
        }
      >
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
            disabled={isLoading || isCompleted}
            required
            touched={emailTouched}
            error={emailError}
          />

          <PasswordInput
            id="password"
            label="Пароль"
            value={password}
            onChange={(value) => {
              setPassword(value);
              clearError();
            }}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            disabled={isLoading || isCompleted}
            required
            minLength={8}
            touched={passwordTouched}
            error={passwordError}
          />

          <PasswordInput
            id="passwordRepeat"
            label="Повторите пароль"
            value={passwordRepeat}
            onChange={(value) => {
              setPasswordRepeat(value);
              clearError();
            }}
            onBlur={() => setPasswordRepeatTouched(true)}
            placeholder="Введите пароль ещё раз"
            autoComplete="new-password"
            disabled={isLoading || isCompleted}
            required
            minLength={8}
            touched={passwordRepeatTouched}
            error={passwordRepeatError}
          />

          {error && (
            <div
              role="alert"
              className="
                rounded-[16px]
                border
                px-4
                py-3
                text-[13px]
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
            {isLoading
              ? "Создаём аккаунт..."
              : isCompleted
                ? "Готово"
                : "Создать аккаунт"}
          </button>
        </form>
      </AuthCard>

      <AuthFooter />
    </>
  );
}
