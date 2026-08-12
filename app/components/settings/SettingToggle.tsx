// app/components/settings/SettingToggle.tsx
type SettingToggleProps = {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  accent: string;
  last?: boolean;
  disabled?: boolean;
};

export default function SettingToggle({
  label,
  description,
  enabled,
  onChange,
  accent,
  last = false,
  disabled = false,
}: SettingToggleProps) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-5 px-5 py-[18px]",
        !last ? "border-b" : "",
      ].join(" ")}
      style={{
        borderColor: "var(--divider)",
      }}
    >
      <div className="min-w-0">
        <p
          className="text-[14px] font-semibold"
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

      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        className="
          relative
          h-7
          w-[46px]
          shrink-0
          rounded-full
          transition-[background-color,box-shadow]
          duration-200
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          backgroundColor: enabled ? accent : "var(--surface)",
          boxShadow: enabled
            ? `0 4px 12px color-mix(in srgb, ${accent} 20%, transparent)`
            : "inset 0 0 0 1px var(--border)",
        }}
      >
        <span
          aria-hidden="true"
          className="
            absolute
            left-1
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow-[0_2px_5px_rgba(0,0,0,0.15)]
            transition-transform
            duration-200
          "
          style={{
            transform: enabled ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}
