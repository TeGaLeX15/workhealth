// app/components/settings/SettingSection.tsx
import type { ReactNode } from "react";

type SettingSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2
          className="
            text-[15px]
            font-bold
            tracking-[-0.02em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-[12px]
            leading-5
          "
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
