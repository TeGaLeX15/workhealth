// app/(auth)/layout.tsx
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
        items-center
        justify-center
        px-5
        py-8
      "
    >
      <div className="w-full max-w-[440px]">{children}</div>
    </main>
  );
}
