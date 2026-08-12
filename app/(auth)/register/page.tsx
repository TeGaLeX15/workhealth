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

import { registerSchema } from "@/app/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [error, setError] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordRepeatTouched, setPasswordRepeatTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
    setPasswordRepeatTouched(true);
    setError("");

    const validation = registerSchema.safeParse({
      email,
      password,
      passwordRepeat,
    });

    if (!validation.success) {
      return;
    }

    setIsLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validation.data.email,
          password: validation.data.password,
          timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Не удалось создать аккаунт");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
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
              setError("");
            }}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            disabled={isLoading}
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
              setError("");
            }}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            disabled={isLoading}
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
              setError("");
            }}
            onBlur={() => setPasswordRepeatTouched(true)}
            placeholder="Введите пароль ещё раз"
            autoComplete="new-password"
            disabled={isLoading}
            required
            minLength={8}
            touched={passwordRepeatTouched}
            error={passwordRepeatError}
          />

          {error && (
            <div
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
            disabled={!isFormValid || isLoading}
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
            {isLoading ? "Создаём аккаунт..." : "Создать аккаунт"}
          </button>
        </form>
      </AuthCard>
      <AuthFooter />
    </>
  );
}
