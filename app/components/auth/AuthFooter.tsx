// app/components/auth/AuthFooter.tsx
import packageJson from "../../../package.json";

export default function AuthFooter() {
  return (
    <footer
      className="
        flex
        items-center
        justify-center
        px-4
        text-[11px]
      "
      style={{
        color: "var(--subtle, var(--muted))",
      }}
    >
      Body OS · версия {packageJson.version}
    </footer>
  );
}