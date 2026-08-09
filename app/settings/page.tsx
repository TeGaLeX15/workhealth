"use client";

import { useEffect, useState } from "react";
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

type ThemeMode = "light" | "dark" | "system";
type AccentKey = "green" | "blue" | "purple" | "orange" | "red";

const ACCENTS: Record<
  AccentKey,
  {
    label: string;
    primary: string;
    dark: string;
  }
> = {
  green: {
    label: "Зелёный",
    primary: "#22c55e",
    dark: "#16a34a",
  },
  blue: {
    label: "Синий",
    primary: "#3b82f6",
    dark: "#2563eb",
  },
  purple: {
    label: "Фиолетовый",
    primary: "#8b5cf6",
    dark: "#7c3aed",
  },
  orange: {
    label: "Оранжевый",
    primary: "#f97316",
    dark: "#ea580c",
  },
  red: {
    label: "Красный",
    primary: "#ef4444",
    dark: "#dc2626",
  },
};

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [accentKey, setAccentKey] = useState<AccentKey>("green");

  const [notifications, setNotifications] = useState({
    workout: true,
    rest: true,
    weekly: true,
  });

  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      setSystemDark(media.matches);
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  const dark =
    themeMode === "dark" ||
    (themeMode === "system" && systemDark);

  const accentConfig = ACCENTS[accentKey];
  const accent = accentConfig.primary;

  const colors = {
    background: dark ? "#09090b" : "#ffffff",
    card: dark ? "#18181b" : "#ffffff",
    surface: dark ? "#27272a" : "#f4f4f5",
    border: dark ? "#27272a" : "#e4e4e7",
    divider: dark ? "#27272a" : "#f4f4f5",
    foreground: dark ? "#fafafa" : "#18181b",
    muted: dark ? "#a1a1aa" : "#71717a",
    subtle: dark ? "#52525b" : "#a1a1aa",
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
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
      }}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-28 pt-5">

        {/* Header */}
        <div className="mb-1">
          <h1 className="text-[26px] font-bold tracking-[-0.03em]">
            Настройки
          </h1>

          <p
            className="mt-1 text-sm"
            style={{ color: colors.muted }}
          >
            Персонализируй BodyOS под себя
          </p>
        </div>

        {/* Profile */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-3 p-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              <UserRound size={21} strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                Профиль
              </p>

              <p
                className="mt-0.5 text-xs"
                style={{ color: colors.muted }}
              >
                Личные данные и цели
              </p>
            </div>

            <ChevronRight
              size={18}
              style={{ color: colors.subtle }}
            />
          </div>
        </section>

        {/* Appearance */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SectionTitle>
            Внешний вид
          </SectionTitle>

          <div className="px-4 pb-4">
            <p className="mb-2.5 text-sm font-semibold">
              Тема
            </p>

            <div className="flex gap-2">
              {[
                {
                  key: "light" as ThemeMode,
                  label: "Светлая",
                  icon: Sun,
                },
                {
                  key: "dark" as ThemeMode,
                  label: "Тёмная",
                  icon: Moon,
                },
                {
                  key: "system" as ThemeMode,
                  label: "Системная",
                  icon: Monitor,
                },
              ].map(({ key, label, icon: Icon }) => {
                const active = themeMode === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setThemeMode(key)}
                    className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition active:scale-[0.97]"
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
                      size={16}
                      strokeWidth={2}
                    />

                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent */}
          <div
            className="border-t px-4 py-4"
            style={{
              borderColor: colors.divider,
            }}
          >
            <p className="mb-3 text-sm font-semibold">
              Акцентный цвет
            </p>

            <div className="flex gap-3">
              {(
                Object.entries(ACCENTS) as [
                  AccentKey,
                  (typeof ACCENTS)[AccentKey],
                ][]
              ).map(([key, value]) => {
                const active = accentKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAccentKey(key)}
                    aria-label={value.label}
                    className="relative h-10 w-10 rounded-xl transition active:scale-95"
                    style={{
                      backgroundColor: value.primary,
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
              className="mt-2 text-center text-[11px]"
              style={{
                color: colors.muted,
              }}
            >
              {accentConfig.label}
            </p>
          </div>
        </section>

        {/* Notifications */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SectionTitle>
            Уведомления
          </SectionTitle>

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
        </section>

        {/* Training */}
        <section
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SectionTitle>
            Тренировки
          </SectionTitle>

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
        </section>

        {/* About */}
        <div
          className="flex items-center justify-center gap-2 pt-2 text-[11px]"
          style={{
            color: colors.subtle,
          }}
        >
          <Dumbbell size={13} />
          BodyOS · версия 1.0.0
        </div>
      </div>
    </main>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="px-4 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
      {children}
    </p>
  );
}

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
      className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
        !last ? "border-b" : ""
      }`}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {label}
        </p>

        <p
          className="mt-0.5 text-xs"
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
        className="relative h-6 w-10 shrink-0 rounded-full transition-colors"
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
      className={`flex items-center justify-between px-4 py-3.5 ${
        !last ? "border-b" : ""
      }`}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          style={{
            color: colors.muted,
          }}
        >
          {icon}
        </span>

        <span className="text-sm font-semibold">
          {label}
        </span>
      </div>

      <span
        className="text-sm"
        style={{
          color: colors.muted,
        }}
      >
        {value}
      </span>
    </div>
  );
}

