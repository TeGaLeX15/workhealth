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

import { useTheme, ACCENTS } from "@/app/providers/theme-provider";

export default function SettingsPage() {
  const { themeMode, setThemeMode, accentKey, setAccentKey, dark } = useTheme();

  const [notifications, setNotifications] = useState({
    workout: true,
    rest: true,
    weekly: true,
  });

  const accentConfig = ACCENTS[accentKey] ?? ACCENTS.green;

  const accent = accentConfig.primary;

  const colors = {
    card: dark ? "#18181b" : "#ffffff",
    surface: dark ? "#27272a" : "#f4f4f5",
    border: dark ? "#2a2a2e" : "#e4e4e7",
    divider: dark ? "#27272a" : "#f1f1f3",
    foreground: dark ? "#fafafa" : "#18181b",
    muted: dark ? "#a1a1aa" : "#71717a",
    subtle: dark ? "#71717a" : "#a1a1aa",
  };

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <main
      className="pb-10 pt-7"
      style={{
        color: colors.foreground,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="mb-9">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{
            color: accent,
          }}
        >
          Настройки
        </p>

        <h1
          className="
            mt-2
            text-[32px]
            font-bold
            leading-[1.05]
            tracking-[-0.05em]
            sm:text-[36px]
          "
          style={{
            color: colors.foreground,
          }}
        >
          Персонализация
        </h1>

        <p
          className="mt-3 max-w-md text-[15px] leading-6"
          style={{
            color: colors.muted,
          }}
        >
          Настрой BodyOS под себя.
        </p>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* PROFILE                                                            */}
      {/* ------------------------------------------------------------------ */}

      <SettingSection title="Профиль" description="Личные данные и цели">
        <button
          type="button"
          className="
            group
            flex
            w-full
            items-center
            gap-4
            rounded-[24px]
            border
            p-4
            text-left
            transition-all
            duration-200
            active:scale-[0.985]
          "
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <div
            className="
              flex
              h-[52px]
              w-[52px]
              shrink-0
              items-center
              justify-center
              rounded-[18px]
              text-white
            "
            style={{
              backgroundColor: accent,
              boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 20%, transparent)`,
            }}
          >
            <UserRound size={22} strokeWidth={2.1} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-[16px] font-bold tracking-[-0.02em]"
              style={{
                color: colors.foreground,
              }}
            >
              Профиль
            </p>

            <p
              className="mt-1 text-[13px]"
              style={{
                color: colors.muted,
              }}
            >
              Имя, параметры и цели
            </p>
          </div>

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor: colors.surface,
            }}
          >
            <ChevronRight
              size={17}
              style={{
                color: colors.subtle,
              }}
            />
          </div>
        </button>
      </SettingSection>

      {/* ------------------------------------------------------------------ */}
      {/* APPEARANCE                                                         */}
      {/* ------------------------------------------------------------------ */}

      <SettingSection title="Внешний вид" description="Тема и цвет интерфейса">
        <div
          className="overflow-hidden rounded-[24px] border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          {/* Theme */}

          <div className="p-5">
            <div className="mb-4">
              <p
                className="text-[15px] font-bold tracking-[-0.02em]"
                style={{
                  color: colors.foreground,
                }}
              >
                Тема
              </p>

              <p
                className="mt-1 text-[13px]"
                style={{
                  color: colors.muted,
                }}
              >
                Выбери комфортный режим
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
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
                  label: "Система",
                  icon: Monitor,
                },
              ].map(({ key, label, icon: Icon }) => {
                const active = themeMode === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setThemeMode(key)}
                    className="
                        flex
                        min-h-[76px]
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        rounded-[18px]
                        text-xs
                        font-semibold
                        transition-all
                        duration-200
                        active:scale-[0.96]
                      "
                    style={{
                      backgroundColor: active ? accent : colors.surface,
                      color: active ? "#ffffff" : colors.muted,
                      boxShadow: active
                        ? `0 8px 22px color-mix(in srgb, ${accent} 18%, transparent)`
                        : "none",
                    }}
                  >
                    <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />

                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent */}

          <div
            className="border-t px-5 py-5"
            style={{
              borderColor: colors.divider,
            }}
          >
            <p
              className="text-[15px] font-bold tracking-[-0.02em]"
              style={{
                color: colors.foreground,
              }}
            >
              Акцентный цвет
            </p>

            <p
              className="mt-1 text-[13px]"
              style={{
                color: colors.muted,
              }}
            >
              Основной цвет интерфейса
            </p>

            <div className="mt-5 flex items-center gap-3.5">
              {(
                Object.entries(ACCENTS) as [
                  keyof typeof ACCENTS,
                  (typeof ACCENTS)[keyof typeof ACCENTS],
                ][]
              ).map(([key, value]) => {
                const active = accentKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAccentKey(key)}
                    aria-label={value.label}
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[15px]
                      transition-all
                      duration-200
                      active:scale-90
                    "
                    style={{
                      backgroundColor: value.primary,
                      boxShadow: active
                        ? `
                          0 0 0 2px ${colors.card},
                          0 0 0 4px ${value.primary},
                          0 7px 20px color-mix(in srgb, ${value.primary} 22%, transparent)
                        `
                        : "none",
                    }}
                  >
                    {active && (
                      <Check size={18} strokeWidth={3} className="text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: accent,
                }}
              />

              <p
                className="text-[13px] font-semibold"
                style={{
                  color: accent,
                }}
              >
                {accentConfig.label}
              </p>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* ------------------------------------------------------------------ */}
      {/* NOTIFICATIONS                                                      */}
      {/* ------------------------------------------------------------------ */}

      <SettingSection
        title="Уведомления"
        description="Напоминания и полезные события"
      >
        <div
          className="overflow-hidden rounded-[24px] border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SettingToggle
            label="Напоминания о тренировке"
            description="Не забывать о запланированной тренировке"
            enabled={notifications.workout}
            onChange={() => toggleNotification("workout")}
            accent={accent}
            colors={colors}
          />

          <SettingToggle
            label="Таймер отдыха"
            description="Уведомление после завершения подхода"
            enabled={notifications.rest}
            onChange={() => toggleNotification("rest")}
            accent={accent}
            colors={colors}
          />

          <SettingToggle
            label="Еженедельный отчёт"
            description="Краткий итог тренировочной недели"
            enabled={notifications.weekly}
            onChange={() => toggleNotification("weekly")}
            accent={accent}
            colors={colors}
            last
          />
        </div>
      </SettingSection>

      {/* ------------------------------------------------------------------ */}
      {/* TRAINING                                                           */}
      {/* ------------------------------------------------------------------ */}

      <SettingSection
        title="Тренировки"
        description="Параметры тренировочного процесса"
      >
        <div
          className="overflow-hidden rounded-[24px] border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <SettingRow
            icon={<Target size={18} />}
            label="Целевые подходы"
            value="4 подхода"
            accent={accent}
            colors={colors}
          />

          <SettingRow
            icon={<Clock3 size={18} />}
            label="Время отдыха"
            value="60–90 сек"
            accent={accent}
            colors={colors}
          />

          <SettingRow
            icon={<TrendingUp size={18} />}
            label="Прогрессия"
            value="Линейная"
            accent={accent}
            colors={colors}
            last
          />
        </div>
      </SettingSection>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      {/* Account */}
      <section className="mt-8">
        <div className="mb-3">
          <h2
            className="text-[15px] font-bold tracking-[-0.02em]"
            style={{
              color: colors.foreground,
            }}
          >
            Аккаунт
          </h2>

          <p
            className="mt-0.5 text-xs"
            style={{
              color: colors.muted,
            }}
          >
            Управление текущей сессией
          </p>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-[20px]
              border
              px-4
              py-4
              text-sm
              font-semibold
              transition
              active:scale-[0.99]
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, #ef4444 5%, var(--card))",
              borderColor:
                "color-mix(in srgb, #ef4444 16%, var(--border))",
              color: "#ef4444",
            }}
          >
            Выйти из аккаунта
          </button>
        </form>
      </section>

      <div
        className="
          flex
          items-center
          justify-center
          gap-2
          pb-1
          pt-4
          text-[11px]
          font-medium
        "
        style={{
          color: colors.subtle,
        }}
      >
        <Dumbbell size={13} />
        <span>BodyOS · версия 1.0.0</span>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
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
    <section className="mb-8">
      <div className="mb-3.5 px-1">
        <h2 className="text-[15px] font-bold tracking-[-0.02em]">{title}</h2>

        <p
          className="mt-1 text-[12px] leading-5"
          style={{
            color: "var(--muted)",
          }}
        >
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle                                                                     */
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
        "flex items-center justify-between gap-5 px-5 py-[18px]",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div className="min-w-0">
        <p
          className="text-[14px] font-semibold"
          style={{
            color: colors.foreground,
          }}
        >
          {label}
        </p>

        <p
          className="mt-1 text-[12px] leading-5"
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
        className="
          relative
          h-7
          w-[46px]
          shrink-0
          rounded-full
          transition-all
          duration-200
          active:scale-95
        "
        style={{
          backgroundColor: enabled ? accent : colors.surface,
          boxShadow: enabled
            ? `0 4px 12px color-mix(in srgb, ${accent} 20%, transparent)`
            : `inset 0 0 0 1px ${colors.border}`,
        }}
      >
        <span
          className="
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow-[0_2px_5px_rgba(0,0,0,0.15)]
            transition-transform
            duration-200
          "
          style={{
            left: enabled ? 22 : 4,
          }}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

function SettingRow({
  icon,
  label,
  value,
  accent,
  colors,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  colors: Record<string, string>;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 px-5 py-[18px]",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: colors.divider,
      }}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
          "
          style={{
            backgroundColor: `color-mix(in srgb, ${accent} 9%, transparent)`,
            color: accent,
          }}
        >
          {icon}
        </div>

        <span
          className="text-[14px] font-semibold"
          style={{
            color: colors.foreground,
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="shrink-0 text-[13px] font-medium"
        style={{
          color: colors.muted,
        }}
      >
        {value}
      </span>
    </div>
  );
}
