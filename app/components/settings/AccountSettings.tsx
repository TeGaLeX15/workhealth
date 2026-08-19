// app/components/settings/AccountSettings.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SettingSection from "@/app/components/settings/SettingSection";

/**
 * Настройки аккаунта.
 *
 * Позволяет пользователю завершить текущую сессию и выйти из аккаунта.
 */
export default function AccountSettings() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Завершает текущую сессию пользователя и перенаправляет на страницу входа.
   */
  async function handleLogout() {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      let data: { error?: string } = {};

      try {
        data = await response.json();
      } catch {
        // API может вернуть пустой ответ или ответ не в формате JSON.
      }

      if (!response.ok) {
        setError(data.error ?? "Не удалось выйти из аккаунта");
        return;
      }

      router.replace("/login");
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingSection title="Аккаунт" description="Управление текущей сессией">
      {error && (
        <p
          role="alert"
          className="
            mb-3
            rounded-xl
            px-3
            py-2
            text-center
            text-xs
            font-medium
          "
          style={{
            color: "#ef4444",
            backgroundColor: "color-mix(in srgb, #ef4444 7%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        aria-busy={isLoading}
        className="
          flex
          h-14
          w-full
          items-center
          justify-center
          rounded-[20px]
          border
          px-4
          text-sm
          font-semibold
          transition
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          backgroundColor: "color-mix(in srgb, #ef4444 5%, var(--card))",
          borderColor: "color-mix(in srgb, #ef4444 16%, var(--border))",
          color: "#ef4444",
        }}
      >
        {isLoading ? "Выходим..." : "Выйти из аккаунта"}
      </button>
    </SettingSection>
  );
}
