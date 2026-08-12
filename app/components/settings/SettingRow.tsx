// app/components/settings/SettingRow.tsx
import type { ReactNode } from "react";

type SettingRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  last?: boolean;
};

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
