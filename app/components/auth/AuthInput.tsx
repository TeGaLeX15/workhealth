// app/components/auth/AuthInput.tsx
import type { HTMLInputAutoCompleteAttribute } from "react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
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
  const hasError = touched && Boolean(error);

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
        aria-describedby={hasError ? `${id}-error` : undefined}
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
          focus:ring-[var(--input-focus-ring)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          backgroundColor: "var(--surface)",
          borderColor: hasError ? "#ef4444" : "var(--border)",
          color: "var(--foreground)",
        }}
      />

      {hasError && (
        <p
          id={`${id}-error`}
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
