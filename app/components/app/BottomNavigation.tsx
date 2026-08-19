// app/components/BottomNavigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Dumbbell, ChartNoAxesColumn, Settings } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";

/**
 * Пункты основной навигации приложения.
 *
 * Используются в нижней навигационной панели
 * на мобильных и компактных экранах.
 */
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

/**
 * Нижняя основная навигация BodyOS.
 *
 * Определяет активный раздел по текущему URL
 * и скрывается во время активной тренировки,
 * чтобы не отвлекать пользователя и не позволять
 * случайно покинуть тренировочный экран.
 */
export default function BottomNavigation() {
  const pathname = usePathname();
  const { accent } = useTheme();

  /**
   * Во время активной тренировки глобальная навигация
   * не отображается.
   */
  const isActiveWorkout = pathname.startsWith("/workout/");

  if (isActiveWorkout) {
    return null;
  }

  return (
    <nav
      aria-label="Основная навигация"
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        w-full
        border-t
        backdrop-blur-xl
      "
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--background) 94%, transparent)",
        borderColor: "var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="
          mx-auto
          flex
          h-[64px]
          w-full
          max-w-xl
          items-stretch
          px-3
        "
      >
        {navigation.map((item) => {
          /**
           * Главная активна только на точном пути "/".
           * Для остальных разделов учитываются вложенные маршруты.
           */
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
              className="
                flex
                min-w-0
                flex-1
                flex-col
                items-center
                justify-center
                rounded-xl
                transition-transform
                duration-200
                active:scale-[0.96]
                motion-reduce:transition-none
              "
              style={{
                color: isActive ? accent : "var(--muted)",
              }}
            >
              {/* Иконка пункта навигации */}
              <span
                className="
                  flex
                  h-8
                  w-10
                  items-center
                  justify-center
                  transition-transform
                  duration-200
                  motion-reduce:transition-none
                "
                style={{
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  aria-hidden="true"
                />
              </span>

              {/* Название пункта навигации */}
              <span
                className="
                  mt-1.5
                  text-[12px]
                  font-semibold
                  leading-none
                "
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
