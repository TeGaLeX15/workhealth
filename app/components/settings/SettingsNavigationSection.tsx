// app/components/settings/SettingsNavigationSection.tsx
import type { ReactNode } from "react";

/**
 * Пропсы секции навигации настроек.
 */
type SettingsNavigationSectionProps = {
  /** Заголовок секции. */
  title: string;

  /** Краткое описание секции. */
  description: string;

  /** Содержимое секции. */
  children: ReactNode;
};

/**
 * Секция навигации настроек с заголовком, описанием и содержимым.
 */
export default function SettingsNavigationSection({
  title,
  description,
  children,
}: SettingsNavigationSectionProps) {
  return (
    <section className="mt-8">
      <div className="mb-3">
        <h2
          className="text-[15px] font-bold tracking-[-0.02em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          {title}
        </h2>

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
