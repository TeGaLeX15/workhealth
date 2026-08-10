// app/(app)/training/page.tsx
import { redirect } from "next/navigation";
import Exercises from "@/app/components/Exercises";
import { getSessionUser } from "@/app/server/auth/session";

export default async function TrainingPage() {
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
          Тренировки
        </p>

        <h1
          className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.045em] sm:text-[34px]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Выбери упражнение
        </h1>

        <p
          className="mt-3 max-w-md text-sm leading-6"
          style={{
            color: "var(--muted)",
          }}
        >
          Выбери упражнение, чтобы открыть программу.
        </p>
      </header>

      {/* Exercises */}
      <section className="mt-7">
        <Exercises />
      </section>
    </>
  );
}
