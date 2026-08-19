// app/components/auth/AuthCard.tsx
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Карточка для содержимого страниц авторизации.
 *
 * Отображает заголовок, описание, основное содержимое
 * и необязательный нижний блок.
 *
 * @param title Заголовок карточки.
 * @param description Описание под заголовком.
 * @param children Основное содержимое карточки.
 * @param footer Необязательный нижний блок карточки.
 */
export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section
      className="
        w-full
        rounded-[26px]
        border
        p-5
        shadow-sm
        sm:p-6
      "
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        boxShadow:
          "0 18px 55px color-mix(in srgb, var(--foreground) 5%, transparent)",
      }}
    >
      <div className="mb-6">
        <h2
          className="
            text-[26px]
            font-bold
            leading-tight
            tracking-[-0.045em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            max-w-[480px]
            text-[14px]
            leading-6
          "
          style={{
            color: "var(--muted)",
          }}
        >
          {description}
        </p>
      </div>

      {children}

      {footer}
    </section>
  );
}
