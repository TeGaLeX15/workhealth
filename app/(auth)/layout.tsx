// app/(auth)/layout.tsx

/**
 * Layout страниц авторизации BodyOS.
 *
 * Центрирует формы авторизации на странице и ограничивает
 * их максимальную ширину для удобного отображения на разных экранах.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
        flex
        min-h-dvh
        items-start
        justify-center
        px-5
        pb-6
        pt-14
        sm:items-center
        sm:py-8
      "
    >
      {/* AUTH CONTENT */}
      <div className="w-full max-w-[440px]">{children}</div>
    </main>
  );
}
