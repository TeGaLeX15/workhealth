"use client";

import { Bell, Volume2 } from "lucide-react";

import SettingsNavigationSection from "@/app/components/settings/SettingsNavigationSection";
import SettingsNavigationRow from "@/app/components/settings/SettingsNavigationRow";
import AppearanceSettings from "@/app/components/settings/AppearanceSettings";
import AccountSettings from "@/app/components/settings/AccountSettings";
import AuthFooter from "@/app/components/auth/AuthFooter";

export default function SettingsPage() {
  return (
    <main
      style={{
        color: "var(--foreground)",
      }}
    >
      {/* HEADER */}
      <header className="mb-9">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{
            color: "var(--accent)",
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
            color: "var(--foreground)",
          }}
        >
          Персонализация
        </h1>

        <p
          className="mt-3 max-w-md text-[15px] leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Настрой BodyOS под себя.
        </p>
      </header>

      {/* THEME */}
      <AppearanceSettings />

      <SettingsNavigationSection
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
      </SettingsNavigationSection>

      {/* ACCOUNT */}
      <AccountSettings />

      {/* VERSION */}
      <AuthFooter />
    </main>
  );
}
