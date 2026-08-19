// app/components/app/PageHeader.tsx
type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Отображает заголовок страницы приложения.
 *
 * Содержит небольшой дополнительный заголовок над основным
 * названием страницы и необязательное описание.
 *
 * @param eyebrow Небольшой дополнительный заголовок.
 * @param title Основной заголовок страницы.
 * @param description Необязательное описание страницы.
 * @returns Заголовок страницы.
 */
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
