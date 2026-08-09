"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Dumbbell,
  ChartNoAxesColumn,
  Settings,
} from "lucide-react";

import { useTheme } from "@/app/providers/theme-provider";

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
  const { dark, accent } = useTheme();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-50 w-full"
      style={{
        backgroundColor: dark
          ? "rgba(9, 9, 11, 0.96)"
          : "rgba(255, 255, 255, 0.96)",
        borderTop: `1px solid ${
          dark ? "#27272a" : "#e4e4e7"
        }`,
        paddingBottom:
          "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex w-full max-w-xl">
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
              aria-current={
                isActive ? "page" : undefined
              }
              className={[
                "relative flex min-h-16 flex-1",
                "flex-col items-center justify-center",
                "gap-1",
                "transition-colors duration-150",
                "active:opacity-70",
                "motion-reduce:transition-none",
              ].join(" ")}
              style={{
                color: isActive
                  ? accent
                  : dark
                    ? "#71717a"
                    : "#a1a1aa",
              }}
            >
              {/* Active indicator */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5"
                style={{
                  backgroundColor: isActive
                    ? accent
                    : "transparent",
                }}
              />

              <Icon
                size={21}
                strokeWidth={
                  isActive ? 2.25 : 1.8
                }
                aria-hidden="true"
              />

              <span className="text-[10px] font-semibold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
