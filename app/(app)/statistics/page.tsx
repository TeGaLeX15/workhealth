// app/statistics/page.tsx
import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";

export default async function StatisticsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pt-7 pb-8">
      {/* Header */}
      <header>
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{
            color: "var(--accent)",
          }}
        >
          Статистика
        </p>

        <h1
          className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.045em] sm:text-[34px]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Твой прогресс
        </h1>

        <p
          className="mt-3 max-w-md text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Здесь появится история тренировок, рекорды и
          динамика твоих результатов.
        </p>
      </header>

      {/* Empty state */}
      <section
        className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border px-6 py-10 text-center"
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
          Когда начнёшь тренироваться, Body OS будет
          собирать результаты и показывать, как меняется
          твоя форма.
        </p>
      </section>
    </div>
  );
}
