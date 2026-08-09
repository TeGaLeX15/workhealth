"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // ─── Validation ───────────────────────────────────────────────────────────

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Введите email";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return "Введите корректный email";
    }

    return "";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) {
      return "Введите пароль";
    }

    if (password.length < 6) {
      return "Пароль должен содержать минимум 6 символов";
    }

    return "";
  }, [password]);

  const isFormValid =
    !emailError &&
    !passwordError &&
    email.trim().length > 0 &&
    password.length > 0;

  // ─── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);
    setError("");

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
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
      {/* Main */}

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-[500px]">

          {/* ─── Brand ───────────────────────────────────────────────────── */}
          <div className="mb-10 text-center">
            <div
              className="
                mx-auto
                flex
                h-[88px]
                w-[88px]
                items-center
                justify-center
                overflow-hidden
                rounded-[27px]
              "
              style={{
                boxShadow:
                  "0 14px 38px color-mix(in srgb, var(--accent) 18%, transparent)",
              }}
            >
              <img
                src="/icons/android-chrome-512x512.png"
                alt="Body OS"
                className="h-full w-full object-cover"
              />
            </div>

            <h1
              className="
                mt-5
                text-[32px]
                font-bold
                leading-none
                tracking-[-0.055em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Body OS
            </h1>

            <p
              className="
                mt-2.5
                text-[15px]
                font-medium
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Твоя система тренировок
            </p>
          </div>

          {/* ─── Login card ──────────────────────────────────────────────── */}

          <section
            className="
              w-full
              rounded-[30px]
              border
              p-8
              shadow-sm
              sm:p-10
            "
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              boxShadow:
                "0 18px 55px color-mix(in srgb, var(--foreground) 5%, transparent)",
            }}
          >
            {/* Header */}

            <div className="mb-7">
              <h2
                className="
                  text-[28px]
                  font-bold
                  leading-tight
                  tracking-[-0.05em]
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                С возвращением
              </h2>

              <p
                className="
                  mt-2.5
                  max-w-[480px]
                  text-[15px]
                  leading-6
                "
                style={{
                  color: "var(--muted)",
                }}
              >
                Войди в аккаунт, чтобы продолжить
                тренировку и следить за своим прогрессом.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* ─── Email ───────────────────────────────────────────────── */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2.5
                    block
                    text-[13px]
                    font-semibold
                  "
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                  aria-invalid={
                    emailTouched && !!emailError
                  }
                  className="
                    h-[60px]
                    w-full
                    rounded-[18px]
                    border
                    px-5
                    text-[16px]
                    outline-none
                    transition
                    placeholder:opacity-45
                    focus:ring-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor:
                      emailTouched && emailError
                        ? "#ef4444"
                        : "var(--border)",
                    color: "var(--foreground)",
                    // @ts-expect-error CSS custom property
                    "--tw-ring-color":
                      "color-mix(in srgb, var(--accent) 20%, transparent)",
                  }}
                />

                {emailTouched && emailError && (
                  <p
                    className="mt-2 text-[12px] font-medium"
                    style={{
                      color: "#ef4444",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* ─── Password ────────────────────────────────────────────── */}

              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
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
                  </label>

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

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    onBlur={() =>
                      setPasswordTouched(true)
                    }
                    placeholder="Введите пароль"
                    disabled={isLoading}
                    required
                    aria-invalid={
                      passwordTouched &&
                      !!passwordError
                    }
                    className="
                      h-[60px]
                      w-full
                      rounded-[18px]
                      border
                      px-5
                      pr-16
                      text-[16px]
                      outline-none
                      transition
                      placeholder:opacity-45
                      focus:ring-2
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor:
                        passwordTouched &&
                        passwordError
                          ? "#ef4444"
                          : "var(--border)",
                      color: "var(--foreground)",
                      // @ts-expect-error CSS custom property
                      "--tw-ring-color":
                        "color-mix(in srgb, var(--accent) 20%, transparent)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    disabled={isLoading}
                    aria-label={
                      showPassword
                        ? "Скрыть пароль"
                        : "Показать пароль"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      flex
                      h-11
                      w-11
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-[14px]
                      transition
                      hover:bg-black/[0.04]
                      active:scale-90
                    "
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        size={19}
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {passwordTouched && passwordError && (
                  <p
                    className="mt-2 text-[12px] font-medium"
                    style={{
                      color: "#ef4444",
                    }}
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* ─── Server error ───────────────────────────────────────── */}

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
                    borderColor:
                      "color-mix(in srgb, #ef4444 18%, transparent)",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </div>
              )}

              {/* ─── Submit ──────────────────────────────────────────────── */}

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

            {/* ─── Register ─────────────────────────────────────────────── */}

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
          </section>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}

      <footer
        className="
          flex
          items-center
          justify-center
          px-4
          pb-5
          text-[11px]
        "
        style={{
          color: "var(--subtle, var(--muted))",
        }}
      >
        Body OS · версия 1.0.0
      </footer>
    </div>
  );
}

