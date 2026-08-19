// app/(app)/page.tsx
import PageHeader from "@/app/components/app/PageHeader";

/**
 * Главная страница Body OS.
 *
 * Отображает приветствие пользователя, состояние сегодняшнего дня
 * и empty state до появления первых данных о тренировках.
 */
export default function HomePage() {
  return (
    <>
      {/* HEADER */}
      <PageHeader
        eyebrow="Добро пожаловать"
        title="Главная"
        description="Твой прогресс, тренировки и основные показатели"
      />

      {/* TODAY */}
      <section
        className="rounded-[26px] border p-5"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--muted)" }}
        >
          Сегодня
        </p>

        <h2
          className="
            mt-2
            text-[22px]
            font-bold
            leading-tight
            tracking-[-0.035em]
          "
          style={{ color: "var(--foreground)" }}
        >
          Всё готово к тренировке
        </h2>

        <p
          className="mt-2 max-w-[310px] text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          Здесь появится твоя сегодняшняя тренировка и основные показатели
        </p>
      </section>

      {/* EMPTY STATE */}
      <section
        className="mt-3 rounded-[26px] border px-6 py-10 text-center"
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
          style={{ color: "var(--foreground)" }}
        >
          Здесь пока пусто
        </h2>

        <p
          className="mx-auto mt-2 max-w-[290px] text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          Начни первую тренировку, и здесь постепенно появятся твой прогресс,
          история и результаты
        </p>
      </section>
    </>
  );
}
