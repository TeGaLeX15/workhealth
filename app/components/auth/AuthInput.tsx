// app/components/auth/AuthInput.tsx
interface AuthInputProps {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  touched?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  touched = false,
  error = "",
  onChange,
  onBlur,
}: AuthInputProps) {
  const hasError = touched && !!error;

  return (
    <div>
      <label
        htmlFor={id}
        className="
          mb-2.5
          block
          text-[13px]
          font-semibold
        "
        style={{
          color: "var(--foreground)",
        }}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        className="
          h-[60px]
          w-full
          rounded-[18px]
          border
          px-5
          text-[16px]
          outline-none
          transition
          placeholder:opacity-45
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          backgroundColor: "var(--surface)",
          borderColor: hasError ? "#ef4444" : "var(--border)",
          color: "var(--foreground)",
          // @ts-expect-error CSS custom property
          "--tw-ring-color":
            "color-mix(in srgb, var(--accent) 20%, transparent)",
        }}
      />

      {hasError && (
        <p
          className="mt-2 text-[12px] font-medium"
          style={{
            color: "#ef4444",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}