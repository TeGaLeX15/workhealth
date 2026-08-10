// app/components/auth/AuthFooter.tsx
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
      Body OS · версия 1.0.0
    </footer>
  );
}