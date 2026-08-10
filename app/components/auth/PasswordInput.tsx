// app/components/auth/PasswordInput.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  touched?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function PasswordInput({
  id,
  label,
  value,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  minLength,
  touched = false,
  error = "",
  onChange,
  onBlur,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          aria-invalid={hasError}
          className="
            h-[60px]
            w-full
            rounded-[18px]
            border
            px-5
            pr-16
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

        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          disabled={disabled}
          aria-label={
            showPassword ? "Скрыть пароль" : "Показать пароль"
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-[14px]
            transition
            hover:bg-black/[0.04]
            active:scale-90
          "
          style={{
            color: "var(--muted)",
          }}
        >
          {showPassword ? (
            <EyeOff size={19} strokeWidth={1.8} />
          ) : (
            <Eye size={19} strokeWidth={1.8} />
          )}
        </button>
      </div>

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