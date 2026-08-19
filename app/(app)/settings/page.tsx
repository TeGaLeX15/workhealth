// app/(app)/settings/page.tsx
import { Bell, Volume2 } from "lucide-react";

import PageHeader from "@/app/components/app/PageHeader";

import AccountSettings from "@/app/components/settings/AccountSettings";
import AppearanceSettings from "@/app/components/settings/AppearanceSettings";
import SettingSection from "@/app/components/settings/SettingSection";
import SettingsNavigationRow from "@/app/components/settings/SettingsNavigationRow";

import AuthFooter from "@/app/components/auth/AuthFooter";

/**
 * Главная страница настроек BodyOS.
 *
 * Содержит настройки внешнего вида, уведомлений и звуков,
 * аккаунта, а также информацию о версии приложения.
 */
export default function SettingsPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <PageHeader
        eyebrow="Настройки"
        title="Персонализация"
        description="Настрой BodyOS под себя"
      />

      {/* APPEARANCE SETTINGS */}
      <AppearanceSettings />

      {/* NOTIFICATIONS & SOUNDS */}
      <SettingSection
        title="Уведомления и звуки"
        description="Напоминания, тренировки и события"
      >
        <SettingsNavigationRow
          href="/settings/notifications"
          icon={<Bell size={19} />}
          label="Уведомления"
          description="Настрой, когда BodyOS будет тебя уведомлять"
        />

        <div
          className="border-t"
          style={{
            borderColor: "var(--divider)",
          }}
        />

        <SettingsNavigationRow
          href="/settings/sounds"
          icon={<Volume2 size={19} />}
          label="Звуки"
          description="Настрой звуки таймера и тренировок"
        />
      </SettingSection>

      {/* ACCOUNT SETTINGS */}
      <AccountSettings />

      {/* APP VERSION & AUTH */}
      <AuthFooter />
    </>
  );
}
