"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Dumbbell,
  ChartNoAxesColumn,
  Settings,
} from "lucide-react";

const navigation = [
  {
    href: "/",
    label: "Главная",
    icon: House,
  },
  {
    href: "/training",
    label: "Тренировки",
    icon: Dumbbell,
  },
  {
    href: "/statistics",
    label: "Статистика",
    icon: ChartNoAxesColumn,
  },
  {
    href: "/settings",
    label: "Настройки",
    icon: Settings,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className={[
        "fixed inset-x-0 bottom-0 z-50",
        "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        "pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-auto mx-auto flex w-full max-w-xl",
          "items-center gap-1",
          "rounded-2xl border border-zinc-200/80",
          "bg-white/95 px-2 py-2",
          "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
          "backdrop-blur-md",
        ].join(" ")}
      >
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex min-h-14 flex-1 shrink-0",
                "flex-col items-center justify-center",
                "gap-1 rounded-xl px-2",
                "text-xs font-medium",
                "transition-colors duration-200",
                "active:scale-[0.96]",
                "motion-reduce:transition-none motion-reduce:active:scale-100",
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700",
              ].join(" ")}
            >
              <Icon
                size={21}
                strokeWidth={isActive ? 2.2 : 1.8}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}