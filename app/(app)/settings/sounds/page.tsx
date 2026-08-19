// app/(app)/settings/sounds/page.tsx
"use client";

import { useEffect } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import Link from "next/link";

import { useTheme } from "@/app/providers/theme-provider";
import SettingSection from "@/app/components/settings/SettingSection";
import SettingToggle from "@/app/components/settings/SettingToggle";
import {
  useSoundSettings,
  useUpdateSoundSettings,
} from "@/app/lib/sounds/useSoundSettings";

type SoundToggleKey = "restCountdown" | "restComplete" | "workoutComplete";

/**
 * Страница настроек звуков Body OS.
 *
 * Позволяет управлять глобальным состоянием звуков
 * и отдельными звуковыми событиями во время тренировки.
 */
export default function SoundsSettingsPage() {
  /* PAGE LIFECYCLE */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* SETTINGS */

  const { accent } = useTheme();

  const sounds = useSoundSettings();
  const updateSounds = useUpdateSoundSettings();

  /* ACTIONS */

  /**
   * Переключает отдельную настройку звука.
   *
   * @param key Ключ звуковой настройки.
   */
  function toggleSound(key: SoundToggleKey) {
    updateSounds((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  /* DERIVED STATE */

  const soundsDisabled = !sounds.enabled;

  return (
    <div
      className="w-full min-w-0 pb-8 sm:pb-10"
      style={{
        color: "var(--foreground)",
      }}
    >
      {/* HEADER */}
      <header className="mb-8 sm:mb-9">
        <Link
          href="/settings"
          scroll={false}
          className="
            mb-5
            inline-flex
            min-h-8
            items-center
            gap-2
            text-[13px]
            font-semibold
            transition-opacity
            hover:opacity-70
            active:opacity-60
          "
          style={{
            color: "var(--muted)",
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          Настройки
        </Link>

        <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[15px]
              sm:h-12
              sm:w-12
              sm:rounded-[16px]
            "
            style={{
              backgroundColor: accent,
              color: "#ffffff",
              boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 20%, transparent)`,
            }}
          >
            <Volume2
              size={20}
              strokeWidth={2.1}
              className="sm:h-[21px] sm:w-[21px]"
            />
          </div>

          <div className="min-w-0 pt-0.5">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.14em]
                sm:text-[11px]
              "
              style={{
                color: accent,
              }}
            >
              Настройки
            </p>

            <h1
              className="
                mt-1
                text-[28px]
                font-bold
                leading-[1.05]
                tracking-[-0.05em]
                sm:text-[34px]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Звуки
            </h1>
          </div>
        </div>

        <p
          className="
            mt-3
            max-w-md
            text-[14px]
            leading-[1.55]
            sm:mt-4
            sm:text-[15px]
            sm:leading-6
          "
          style={{
            color: "var(--muted)",
          }}
        >
          Настрой звуки, которые BodyOS использует во время тренировки.
        </p>
      </header>

      {/* GENERAL */}
      <SettingSection title="Общие" description="Основной контроль звуков">
        <div
          className="
            w-full
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            sm:rounded-[24px]
          "
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SettingToggle
            label="Звуки"
            description="Включить все звуки BodyOS"
            enabled={sounds.enabled}
            onChange={() =>
              updateSounds((current) => ({
                ...current,
                enabled: !current.enabled,
              }))
            }
            accent={accent}
            last
          />
        </div>
      </SettingSection>

      {/* WORKOUT */}
      <SettingSection
        title="Тренировка"
        description="Звуковые события во время тренировки"
      >
        <div
          className="
            w-full
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            sm:rounded-[24px]
          "
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SettingToggle
            label="Обратный отсчёт"
            description="Звуки последних секунд таймера отдыха"
            enabled={sounds.enabled && sounds.restCountdown}
            onChange={() => toggleSound("restCountdown")}
            accent={accent}
            disabled={soundsDisabled}
          />

          <SettingToggle
            label="Окончание отдыха"
            description="Звуковой сигнал после завершения таймера"
            enabled={sounds.enabled && sounds.restComplete}
            onChange={() => toggleSound("restComplete")}
            accent={accent}
            disabled={soundsDisabled}
          />

          <SettingToggle
            label="Завершение тренировки"
            description="Финальный звук после последнего подхода"
            enabled={sounds.enabled && sounds.workoutComplete}
            onChange={() => toggleSound("workoutComplete")}
            accent={accent}
            disabled={soundsDisabled}
            last
          />
        </div>
      </SettingSection>
    </div>
  );
}
