// app/(app)/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/server/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {/* Header */}
      <header>
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{
            color: "var(--accent)",
          }}
        >
          Добро пожаловать
        </p>

        <h1
          className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.045em] sm:text-[34px]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Главная
        </h1>
      </header>

      {/* Today */}
      <section
        className="mt-7 rounded-[26px] border p-5"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
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
          className="mt-2 max-w-[310px] text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Здесь появится твоя сегодняшняя тренировка и основные показатели.
        </p>
      </section>

      {/* Empty state */}
      <section
        className="mt-10 rounded-[26px] border px-6 py-10 text-center"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 10%, transparent)",
            color: "var(--accent)",
          }}
        >
          <span className="text-[26px] font-light leading-none">+</span>
        </div>

        <h2
          className="mt-5 text-lg font-bold tracking-[-0.025em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Здесь пока пусто
        </h2>

        <p
          className="mx-auto mt-2 max-w-[290px] text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Начни первую тренировку, и здесь постепенно появятся твой прогресс,
          история и результаты.
        </p>
      </section>
    </>
  );
}
