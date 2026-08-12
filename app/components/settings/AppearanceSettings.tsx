// app/components/settings/AppearanceSettings.tsx
"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme, ACCENTS } from "@/app/providers/theme-provider";
import SettingSection from "@/app/components/settings/SettingSection";

export default function AppearanceSettings() {
  const { themeMode, setThemeMode, accentKey, setAccentKey, dark } = useTheme();

  const accentConfig = ACCENTS[accentKey] ?? ACCENTS.green;
  const accent = accentConfig.primary;

  const colors = {
    card: dark ? "#18181b" : "#ffffff",
    surface: dark ? "#27272a" : "#f4f4f5",
    border: dark ? "#2a2a2e" : "#e4e4e7",
    divider: dark ? "#27272a" : "#f1f1f3",
    foreground: dark ? "#fafafa" : "#18181b",
    muted: dark ? "#a1a1aa" : "#71717a",
  };

  const themes = [
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
  ];

  return (
    <SettingSection title="Внешний вид" description="Тема и цвет интерфейса">
      <div
        className="overflow-hidden rounded-[24px] border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        {/* THEME */}

        <div className="p-5">
          <div className="mb-4">
            <p
              className="text-[15px] font-bold tracking-[-0.02em]"
              style={{ color: colors.foreground }}
            >
              Тема
            </p>

            <p className="mt-1 text-[13px]" style={{ color: colors.muted }}>
              Выбери комфортный режим
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {themes.map(({ key, label, icon: Icon }) => {
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

        {/* ACCENT */}

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

          <div className="mt-5 grid grid-cols-5 gap-3">
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
                  aria-pressed={active}
                  className="
                    relative
                    flex
                    aspect-square
                    w-full
                    max-w-[52px]
                    items-center
                    justify-center
                    justify-self-center
                    rounded-[16px]
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
                    <Check size={18} strokeWidth={3} color={value.contrast} />
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
  );
}
