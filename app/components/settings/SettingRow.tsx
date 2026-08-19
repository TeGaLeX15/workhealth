// app/components/settings/SettingRow.tsx
import type { ReactNode } from "react";

/**
 * Пропсы строки настройки.
 */
type SettingRowProps = {
  /** Иконка настройки. */
  icon: ReactNode;

  /** Название настройки. */
  label: string;

  /** Текущее значение настройки. */
  value: string;

  /** Указывает, является ли строка последней в секции. */
  last?: boolean;
};

/**
 * Строка настройки с иконкой, названием и текущим значением.
 */
export default function SettingRow({
  icon,
  label,
  value,
  last = false,
}: SettingRowProps) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 px-5 py-[18px]",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: "var(--divider)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
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
            backgroundColor:
              "color-mix(in srgb, var(--accent) 9%, transparent)",
            color: "var(--accent)",
          }}
        >
          {icon}
        </div>

        <span
          className="truncate text-[14px] font-semibold"
          style={{
            color: "var(--foreground)",
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="shrink-0 text-[13px] font-medium"
        style={{
          color: "var(--muted)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
