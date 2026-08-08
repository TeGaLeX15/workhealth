"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== passwordRepeat) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-300"
          >
            ← WorkHealth
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            Создать аккаунт
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Начни отслеживать свои тренировки и прогресс.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Пароль
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Минимум 8 символов"
                disabled={isLoading}
                required
                minLength={8}
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 pr-20 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-500 transition hover:text-zinc-300"
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="passwordRepeat"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Повторите пароль
            </label>

            <div className="relative">
              <input
                id="passwordRepeat"
                type={showPasswordRepeat ? "text" : "password"}
                autoComplete="new-password"
                value={passwordRepeat}
                onChange={(event) => setPasswordRepeat(event.target.value)}
                placeholder="Введите пароль ещё раз"
                disabled={isLoading}
                required
                minLength={8}
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 pr-20 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => setShowPasswordRepeat((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-500 transition hover:text-zinc-300"
              >
                {showPasswordRepeat ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Создаём аккаунт..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-300 transition hover:text-white"
          >
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}