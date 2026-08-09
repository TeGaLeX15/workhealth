// app/components/AppHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";

export default function AppHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--background) 88%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Body OS — главная"
          className="flex items-center gap-3 transition-opacity active:opacity-70"
        >
          <div
            className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px]"
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
              className="text-[17px] font-bold tracking-[-0.04em]"
              style={{
                color: "var(--foreground)",
              }}
            >
              Body OS
            </div>

            <div
              className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color: "var(--muted)",
              }}
            >
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
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <UserRound size={19} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
