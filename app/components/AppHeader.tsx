"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

import { useTheme } from "@/app/providers/theme-provider";

export default function AppHeader() {
  const { dark, accent } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor: dark
          ? "rgba(9, 9, 11, 0.88)"
          : "rgba(255, 255, 255, 0.88)",
        borderColor: dark ? "#27272a" : "#f0f0f1",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          aria-label="BodyOS — главная"
          className="flex items-center gap-2.5 rounded-xl transition-transform active:scale-[0.98]"
        >
          {/* Временный логотип */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black tracking-tight shadow-sm"
            style={{
              backgroundColor: dark ? "#fafafa" : "#18181b",
              color: dark ? "#18181b" : "#ffffff",
            }}
          >
            B
          </div>

          <div className="leading-none">
            <div
              className="text-[16px] font-bold tracking-[-0.035em]"
              style={{
                color: dark ? "#fafafa" : "#18181b",
              }}
            >
              BodyOS
            </div>

            <div
              className="mt-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em]"
              style={{
                color: dark ? "#71717a" : "#a1a1aa",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: accent,
                }}
              />

              Fitness system
            </div>
          </div>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          aria-label="Профиль"
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-90"
          style={{
            borderColor: dark ? "#3f3f46" : "#e4e4e7",
            backgroundColor: dark ? "#18181b" : "#fafafa",
            color: dark ? "#a1a1aa" : "#71717a",
          }}
        >
          <UserRound
            size={19}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
}