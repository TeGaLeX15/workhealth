// app/components/auth/AuthCard.tsx
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

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
        rounded-[30px]
        border
        p-6
        shadow-sm
        sm:p-10
      "
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        boxShadow:
          "0 18px 55px color-mix(in srgb, var(--foreground) 5%, transparent)",
      }}
    >
      <div className="mb-7">
        <h2
          className="
            text-[28px]
            font-bold
            leading-tight
            tracking-[-0.05em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          {title}
        </h2>

        <p
          className="
            mt-2.5
            max-w-[480px]
            text-[15px]
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