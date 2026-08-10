// app/components/BottomNavigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Dumbbell, ChartNoAxesColumn, Settings } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";

// Navigation items
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
      className="fixed inset-x-0 bottom-0 z-50 w-full border-t backdrop-blur-xl"
      style={{
        backgroundColor: dark
          ? "rgba(9, 9, 11, 0.94)"
          : "rgba(255, 255, 255, 0.94)",
        borderColor: "var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {" "}
      <div className="mx-auto flex h-18 w-full max-w-xl items-stretch px-3">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            // Navigation link
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex min-w-0 flex-1 flex-col items-center justify-center",
                "transition-transform duration-150",
                "active:scale-[0.96]",
                "motion-reduce:transition-none",
              ].join(" ")}
              style={{
                color: isActive ? accent : "var(--muted)",
              }}
            >
              {/* Icon */}
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isActive
                    ? `color-mix(in srgb, var(--accent) 12%, transparent)`
                    : "transparent",
                }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  aria-hidden="true"
                />
              </span>

              {/* Label */}
              <span
                className="my-1.5 text-[12px] font-semibold leading-none"
                style={{
                  color: isActive ? accent : "var(--muted)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
