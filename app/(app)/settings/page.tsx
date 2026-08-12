// app/(app)/settings/page.tsx
import { Bell, Volume2 } from "lucide-react";

import SettingSection from "@/app/components/settings/SettingSection";
import SettingsNavigationRow from "@/app/components/settings/SettingsNavigationRow";
import AppearanceSettings from "@/app/components/settings/AppearanceSettings";
import AccountSettings from "@/app/components/settings/AccountSettings";
import AuthFooter from "@/app/components/auth/AuthFooter";
import PageHeader from "@/app/components/app/PageHeader";

export default function SettingsPage() {
  return (
    <>
      {/* HEADER */}
      <PageHeader
        eyebrow="Настройки"
        title="Персонализация"
        description="Настрой BodyOS под себя"
      />

      {/* THEME */}
      <AppearanceSettings />

      {/* NOTIFICATIONS */}
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
          disabled
        />
      </SettingSection>

      {/* ACCOUNT */}
      <AccountSettings />

      {/* VERSION */}
      <AuthFooter />
    </>
  );
}
