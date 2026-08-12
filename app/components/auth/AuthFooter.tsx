// app/components/auth/AuthFooter.tsx
import { APP_VERSION } from "@/app/lib/app-version";

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
      Body OS · версия {APP_VERSION}
    </footer>
  );
}
