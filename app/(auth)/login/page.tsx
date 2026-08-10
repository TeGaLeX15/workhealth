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

import { loginSchema } from "@/app/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // ─── Validation ───────────────────────────────────────────────────────────

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

  // ─── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);
    setError("");

    const validation = loginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      return;
    }

    setIsLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validation.data,
          timezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Не удалось войти");
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
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-[500px]">
          <AuthBrand />

          <AuthCard
            title="С возвращением"
            description="Войди в аккаунт, чтобы продолжить тренировку и следить за своим прогрессом."
            footer={
              <div className="mt-7 flex items-center justify-center">
                <span
                  className="text-[14px]"
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
                    min-h-11
                    items-center
                    rounded-xl
                    px-2
                    text-[14px]
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
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span
                    className="
                      block
                      text-[13px]
                      font-semibold
                    "
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
                      min-h-11
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
                    Забыли пароль?
                  </Link>
                </div>

                <PasswordInput
                  id="password"
                  label=""
                  value={password}
                  onChange={(value) => {
                    setPassword(value);
                    setError("");
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  touched={passwordTouched}
                  error={passwordError}
                />
              </div>

              {error && (
                <div
                  className="
                    rounded-[17px]
                    border
                    px-4
                    py-3.5
                    text-[13px]
                    leading-5
                  "
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, #ef4444 6%, transparent)",
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
                  mt-2
                  flex
                  h-[62px]
                  w-full
                  items-center
                  justify-center
                  rounded-[18px]
                  text-[16px]
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
                    "0 9px 26px color-mix(in srgb, var(--accent) 18%, transparent)",
                }}
              >
                {isLoading ? "Входим..." : "Войти"}
              </button>
            </form>
          </AuthCard>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
