// app/(app)/settings/notifications/page.tsx
"use client";

import { useEffect } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";

import { useTheme } from "@/app/providers/theme-provider";
import SettingSection from "@/app/components/settings/SettingSection";
import SettingToggle from "@/app/components/settings/SettingToggle";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/app/lib/notifications/useNotificationSettings";

/**
 * Страница настроек уведомлений BodyOS.
 *
 * Позволяет управлять глобальным состоянием уведомлений пользователя.
 */
export default function NotificationsSettingsPage() {
  /* ==========================================================================
     PAGE LIFECYCLE
     ========================================================================== */

  /**
   * Возвращает страницу в начало при её открытии.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ==========================================================================
     SETTINGS
     ========================================================================== */

  const { accent } = useTheme();

  const notifications = useNotificationSettings();
  const updateNotifications = useUpdateNotificationSettings();

  /* ==========================================================================
     ACTIONS
     ========================================================================== */

  /**
   * Переключает глобальное состояние уведомлений.
   */
  function toggleNotifications() {
    updateNotifications((current) => ({
      ...current,
      enabled: !current.enabled,
    }));
  }

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
            <Bell
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
              Уведомления
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
          Настрой уведомления, которые BodyOS будет отправлять тебе.
        </p>
      </header>

      {/* GENERAL */}
      <SettingSection title="Общие" description="Основной контроль уведомлений">
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
            label="Разрешить уведомления"
            description="Включить все уведомления BodyOS"
            enabled={notifications.enabled}
            onChange={toggleNotifications}
            accent={accent}
            last
          />
        </div>
      </SettingSection>
    </div>
  );
}
