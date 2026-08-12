// app/components/app/PageHeader.tsx
type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-5 text-center">
      <p
        className="text-xs font-semibold uppercase tracking-[0.12em]"
        style={{
          color: "var(--accent)",
        }}
      >
        {eyebrow}
      </p>

      <h1
        className="
          mt-2
          text-[30px]
          font-bold
          leading-tight
          tracking-[-0.045em]
          sm:text-[34px]
        "
        style={{
          color: "var(--foreground)",
        }}
      >
        {title}
      </h1>

      {description && (
        <p
          className="mx-auto max-w-md text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          {description}
        </p>
      )}
    </header>
  );
}