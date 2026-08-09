"use client";

import { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Check,
  UserRound,
  Dumbbell,
  Clock3,
  Target,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import {
  useTheme,
  ACCENTS,
} from "@/app/providers/theme-provider";

export default function SettingsPage() {
  const {
    themeMode,
    setThemeMode,
    accentKey,
    setAccentKey,
    dark,
  } = useTheme();

  const [notifications, setNotifications] = useState({
    workout: true,
    rest: true,
    weekly: true,
  });

  const accentConfig =
    ACCENTS[accentKey] ?? ACCENTS.green;

  const accent = accentConfig.primary;

  const colors = {
    card: dark ? "#18181b" : "#ffffff",
    surface: dark ? "#27272a" : "#f4f4f5",
    border: dark ? "#27272a" : "#e4e4e7",
    divider: dark ? "#27272a" : "#f4f4f5",
    foreground: dark ? "#fafafa" : "#18181b",
    muted: dark ? "#a1a1aa" : "#71717a",
    subtle: dark ? "#71717a" : "#a1a1aa",
  };

  function toggleNotification(
    key: keyof typeof notifications
  ) {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <main
      className="py-4"
      style={{
        color: colors.foreground,
      }}
    >
      {/* Page header */}
      <header className="mb-7">
        <h1 className="text-[28px] font-bold tracking-[-0.035em]">
          Настройки
        </h1>

        <p
          className="mt-1.5 text-sm"
          style={{ color: colors.muted }}
        >
          Персонализируй BodyOS под себя
        </p>
      </header>

      {/* Profile */}
      <SettingSection
        title="Профиль"
        description="Личные данные и цели"
      >
        <button
          type="button"
          className="flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition active:scale-[0.99]"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{
              backgroundColor: accent,
            }}
          >
            <UserRound
              size={20}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              Профиль
            </p>

            <p
              className="mt-0.5 text-xs"
              style={{ color: colors.muted }}
            >
              Имя, параметры и цели
            </p>
          </div>

          <ChevronRight
            size={18}
            style={{
              color: colors.subtle,
            }}
          />
        </button>
      </SettingSection>

      {/* Appearance */}
      <SettingSection
        title="Внешний вид"
        description="Тема и цвет интерфейса"
      >
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          {/* Theme */}
          <div className="p-4">
            <p className="mb-3 text-sm font-semibold">
              Тема
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  key: "light" as const,
                  label: "Светлая",
                  icon: Sun,
                },
                {
                  key: "dark" as const,
                  label: "Тёмная",
                  icon: Moon,
                },
                {
                  key: "system" as const,
                  label: "Системная",
                  icon: Monitor,
                },
              ].map(
                ({
                  key,
                  label,
                  icon: Icon,
                }) => {
                  const active =
                    themeMode === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setThemeMode(key)
                      }
                      className="flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition active:scale-[0.97]"
                      style={{
                        backgroundColor: active
                          ? accent
                          : colors.surface,
                        color: active
                          ? "#ffffff"
                          : colors.muted,
                      }}
                    >
                      <Icon
                        size={17}
                        strokeWidth={
                          active ? 2.2 : 1.8
                        }
                      />

                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Accent */}
          <div
            className="border-t p-4"
            style={{
              borderColor: colors.divider,
            }}
          >
            <p className="text-sm font-semibold">
              Акцентный цвет
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: colors.muted,
              }}
            >
              Цвет основных элементов интерфейса
            </p>

            <div className="mt-4 flex items-center gap-3">
              {(
                Object.entries(
                  ACCENTS
                ) as [
                  keyof typeof ACCENTS,
                  (typeof ACCENTS)[keyof typeof ACCENTS],
                ][]
              ).map(([key, value]) => {
                const active =
                  accentKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setAccentKey(key)
                    }
                    aria-label={value.label}
                    className="relative h-10 w-10 rounded-xl transition active:scale-90"
                    style={{
                      backgroundColor:
                        value.primary,
                      boxShadow: active
                        ? `0 0 0 2px ${colors.card}, 0 0 0 4px ${value.primary}`
                        : "none",
                    }}
                  >
                    {active && (
                      <Check
                        size={17}
                        strokeWidth={3}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <p
              className="mt-3 text-xs font-medium"
              style={{
                color: accent,
              }}
            >
              {accentConfig.label}
            </p>
          </div>
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection
        title="Уведомления"
        description="Напоминания и полезные события"
      >
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SettingToggle
            label="Напоминания о тренировке"
            description="Не забывать о запланированной тренировке"
            enabled={notifications.workout}
            onChange={() =>
              toggleNotification("workout")
            }
            accent={accent}
            colors={colors}
          />

          <SettingToggle
            label="Таймер отдыха"
            description="Уведомление после завершения подхода"
            enabled={notifications.rest}
            onChange={() =>
              toggleNotification("rest")
            }
            accent={accent}
            colors={colors}
          />

          <SettingToggle
            label="Еженедельный отчёт"
            description="Краткий итог тренировочной недели"
            enabled={notifications.weekly}
            onChange={() =>
              toggleNotification("weekly")
            }
            accent={accent}
            colors={colors}
            last
          />
        </div>
      </SettingSection>

      {/* Training */}
      <SettingSection
        title="Тренировки"
        description="Параметры тренировочного процесса"
      >
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SettingRow
            icon={<Target size={17} />}
            label="Целевые подходы"
            value="4 подхода"
            colors={colors}
          />

          <SettingRow
            icon={<Clock3 size={17} />}
            label="Время отдыха"
            value="60–90 сек"
            colors={colors}
          />

          <SettingRow
            icon={<TrendingUp size={17} />}
            label="Прогрессия"
            value="Линейная"
            colors={colors}
            last
          />
        </div>
      </SettingSection>

      {/* About */}
      <div
        className="flex items-center justify-center gap-2 pb-2 pt-2 text-[11px]"
        style={{
          color: colors.subtle,
        }}
      >
        <Dumbbell size={13} />
        BodyOS · версия 1.0.0
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

function SettingSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-3 px-0.5">
        <h2 className="text-sm font-bold tracking-[-0.01em]">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                      */
/* -------------------------------------------------------------------------- */

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
  accent,
  colors,
  last = false,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  accent: string;
  colors: Record<string, string>;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 px-4 py-3.5",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {label}
        </p>

        <p
          className="mt-0.5 text-xs leading-5"
          style={{
            color: colors.muted,
          }}
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={enabled}
        className="relative h-6 w-10 shrink-0 rounded-full transition active:scale-95"
        style={{
          backgroundColor: enabled
            ? accent
            : colors.surface,
        }}
      >
        <span
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
          style={{
            left: enabled ? 20 : 4,
          }}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Row                                                                         */
/* -------------------------------------------------------------------------- */

function SettingRow({
  icon,
  label,
  value,
  colors,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: Record<string, string>;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 px-4 py-4",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div
        className="flex items-center gap-3"
        style={{
          color: colors.muted,
        }}
      >
        {icon}

        <span className="text-sm font-semibold">
          {label}
        </span>
      </div>

      <span
        className="shrink-0 text-sm"
        style={{
          color: colors.muted,
        }}
      >
        {value}
      </span>
    </div>
  );
}
