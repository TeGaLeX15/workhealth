// app/components/auth/AuthFooter.tsx
import { APP_VERSION } from "@/app/lib/app-version";

/**
 * Нижний блок страниц авторизации.
 *
 * Отображает название приложения и текущую версию BodyOS.
 *
 * @returns Футер страницы авторизации.
 */
export default function AuthFooter() {
  return (
    <footer
      className="
        mt-6
        flex
        items-center
        justify-center
        px-4
        text-[11px]
        sm:mt-8
      "
      style={{
        color: "var(--subtle, var(--muted))",
      }}
    >
      BodyOS · версия {APP_VERSION}
    </footer>
  );
}
