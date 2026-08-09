// app/page.tsx
import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pt-7 sm:pt-9">
      {/* Header */}
      <header>
        <p
          className="text-sm font-medium"
          style={{
            color: "var(--muted)",
          }}
        >
          Добро пожаловать
        </p>

        <h1
          className="mt-1 text-[32px] font-bold leading-none tracking-[-0.05em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Главная
        </h1>
      </header>

      {/* Today */}
      <section
        className="mt-7 rounded-[24px] border p-5"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--muted)",
            }}
          >
            Сегодня
          </p>

          <h2
            className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.035em]"
            style={{
              color: "var(--foreground)",
            }}
          >
            Всё готово к тренировке
          </h2>

          <p
            className="mt-2 max-w-[300px] text-sm leading-5"
            style={{
              color: "var(--muted)",
            }}
          >
            Здесь появится твоя сегодняшняя тренировка и основные показатели.
          </p>
        </div>
      </section>

      {/* Empty state */}
      <section className="mt-10">
        <div className="text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 10%, transparent)",
            }}
          >
            <span
              className="text-xl font-bold"
              style={{
                color: "var(--accent)",
              }}
            >
              +
            </span>
          </div>

          <h2
            className="mt-4 text-lg font-bold tracking-[-0.025em]"
            style={{
              color: "var(--foreground)",
            }}
          >
            Здесь пока пусто
          </h2>

          <p
            className="mx-auto mt-1.5 max-w-[280px] text-sm leading-5"
            style={{
              color: "var(--muted)",
            }}
          >
            По мере использования Body OS здесь появится твой прогресс и история
            тренировок.
          </p>
        </div>
      </section>
    </div>
  );
}
