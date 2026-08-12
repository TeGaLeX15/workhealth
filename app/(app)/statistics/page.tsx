import PageHeader from "@/app/components/app/PageHeader";

// app/(app)/statistics/page.tsx
export default async function StatisticsPage() {
  return (
    <>
      {/* HEADER */}
      <PageHeader
        eyebrow="Статистика"
        title="Твой прогресс"
        description="Здесь появится история тренировок, рекорды и динамика твоих результатов"
      />

      {/* EMPTY BLOCK */}
      <section
        className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border px-6 py-10 text-center"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 10%, var(--surface))",
            color: "var(--accent)",
          }}
        >
          <span className="text-2xl font-bold">↗</span>
        </div>

        <h2
          className="mt-5 text-lg font-bold tracking-[-0.02em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Статистика скоро здесь
        </h2>

        <p
          className="mt-2 max-w-xs text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Когда начнёшь тренироваться, Body OS будет собирать результаты и
          показывать, как меняется твоя форма.
        </p>
      </section>
    </>
  );
}
