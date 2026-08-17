// app/components/auth/ResetPasswordForm.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import PasswordInput from "@/app/components/auth/PasswordInput";

import { useAsyncSubmit } from "@/app/lib/hooks/useAsyncSubmit";
import { apiClient } from "@/app/lib/api/client";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const { isLoading, error, execute, clearError } = useAsyncSubmit();

  const passwordError =
    passwordTouched && password.length < 8
      ? "Пароль должен содержать минимум 8 символов"
      : "";

  const confirmPasswordError =
    confirmPasswordTouched && confirmPassword !== password
      ? "Пароли не совпадают"
      : "";

  const isFormValid = password.length >= 8 && confirmPassword === password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!isFormValid || isLoading || isCompleted) {
      return;
    }

    const result = await execute((signal) =>
      apiClient<{ success: boolean }>("/api/auth/reset-password", {
        method: "POST",
        signal,
        body: JSON.stringify({
          token,
          password,
        }),
      }),
    );

    if (result === null) {
      return;
    }

    setIsCompleted(true);
  }

  if (isCompleted) {
    return (
      <div className="space-y-4">
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
            borderColor: "color-mix(in srgb, var(--accent) 18%, var(--border))",
            color: "var(--foreground)",
          }}
        >
          Пароль успешно изменён. Все предыдущие сессии завершены.
        </div>

        <Link
          href="/login"
          className="
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
          "
          style={{
            backgroundColor: "var(--accent)",
            boxShadow:
              "0 7px 20px color-mix(in srgb, var(--accent) 18%, transparent)",
          }}
        >
          Перейти ко входу
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      <PasswordInput
        id="password"
        label="Новый пароль"
        value={password}
        onChange={(value) => {
          setPassword(value);
          clearError();
        }}
        onBlur={() => setPasswordTouched(true)}
        placeholder="Введите новый пароль"
        autoComplete="new-password"
        disabled={isLoading}
        required
        touched={passwordTouched}
        error={passwordError}
      />

      <PasswordInput
        id="confirm-password"
        label="Повторите пароль"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value);
          clearError();
        }}
        onBlur={() => setConfirmPasswordTouched(true)}
        placeholder="Повторите новый пароль"
        autoComplete="new-password"
        disabled={isLoading}
        required
        touched={confirmPasswordTouched}
        error={confirmPasswordError}
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
            backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
            borderColor: "color-mix(in srgb, #ef4444 18%, var(--border))",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        aria-disabled={!isFormValid || isLoading}
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
        {isLoading ? "Сохраняем..." : "Изменить пароль"}
      </button>
    </form>
  );
}
