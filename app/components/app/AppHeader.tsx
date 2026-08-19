// app/components/AppHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Отображает основную шапку приложения.
 *
 * Содержит логотип BodyOS, ссылку на главную страницу
 * и переход в профиль пользователя. Также показывает
 * текущее состояние интернет-соединения.
 *
 * @returns Шапка приложения.
 */
export default function AppHeader() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    /**
     * Обновляет состояние подключения к интернету.
     */
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        backdrop-blur-xl
      "
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--background) 88%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="
          mx-auto
          flex
          h-[68px]
          w-full
          max-w-xl
          items-center
          justify-between
          px-5
        "
      >
        <Link
          href="/"
          aria-label="BodyOS — главная"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            transition-opacity
            active:opacity-70
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-[11px]
            "
            style={{
              backgroundColor: "var(--foreground)",
            }}
          >
            <Image
              src="/icons/favicon-32x32.png"
              alt=""
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>

          <div className="leading-none">
            <div
              className="
                text-[17px]
                font-bold
                tracking-[-0.04em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              BodyOS
            </div>

            <div
              className="
                mt-1
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Fitness system
            </div>
          </div>
        </Link>

        <Link
          href="/profile"
          aria-label={isOnline ? "Профиль — онлайн" : "Профиль — офлайн"}
          className="
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            active:scale-90
          "
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <UserRound size={19} strokeWidth={1.8} aria-hidden="true" />

          <span
            aria-hidden="true"
            className="
              absolute
              bottom-0
              right-0
              h-3
              w-3
              rounded-full
              border-2
            "
            style={{
              backgroundColor: isOnline ? "var(--accent)" : "#ef4444",
              borderColor: "var(--surface)",
            }}
          />
        </Link>
      </div>
    </header>
  );
}
