// app/components/settings/SettingsNavigationRow.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SettingsNavigationRowProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  disabled?: boolean;
};

export default function SettingsNavigationRow({
  href,
  icon,
  label,
  description,
  disabled = false,
}: SettingsNavigationRowProps) {
  const content = (
    <>
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-[13px]
        "
        style={{
          backgroundColor: "color-mix(in srgb, var(--accent) 9%, transparent)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[15px] font-bold tracking-[-0.02em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          {label}
        </p>

        <p
          className="mt-1 text-[12px] leading-5"
          style={{
            color: "var(--muted)",
          }}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        strokeWidth={1.8}
        className="shrink-0"
        style={{
          color: "var(--subtle)",
        }}
      />
    </>
  );

  if (disabled) {
    return (
      <div
        className="
          flex
          w-full
          items-center
          gap-4
          py-4
          opacity-45
        "
      >
        {content}
      </div>
    );
  }

  return (
<Link
  href={href}
  className="
    flex
    w-full
    items-center
    gap-4
    py-4
    text-left
    transition-opacity
    duration-200
    active:opacity-60
  "
>
  {content}
</Link>
  );
}
