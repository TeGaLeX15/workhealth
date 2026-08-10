// app/components/settings/AccountSettings.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountSettings() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Не удалось выйти из аккаунта");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <div>
        <h2
          className="text-base font-semibold"
          style={{
            color: "var(--foreground)",
          }}
        >
          Аккаунт
        </h2>

        <p
          className="mt-0.5 text-xs"
          style={{
            color: "var(--muted)",
          }}
        >
          Управление текущей сессией
        </p>
      </div>

      <div className="mt-4">
        {error && (
          <p
            className="mb-3 rounded-xl px-3 py-2 text-center text-xs"
            style={{
              color: "#ef4444",
              backgroundColor:
                "color-mix(in srgb, #ef4444 7%, transparent)",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
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
            disabled:opacity-50
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, #ef4444 5%, var(--card))",
            borderColor:
              "color-mix(in srgb, #ef4444 16%, var(--border))",
            color: "#ef4444",
          }}
        >
          {isLoading ? "Выходим..." : "Выйти из аккаунта"}
        </button>
      </div>
    </section>
  );
}
