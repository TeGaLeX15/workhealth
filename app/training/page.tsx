import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";
import Exercises from "@/app/components/Exercises";

export default async function TrainingPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="py-6">
      <header className="pt-2">
        <p
          className="text-sm font-semibold"
          style={{
            color: "var(--accent)",
          }}
        >
          Тренировки
        </p>

        <h1
          className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.04em]"
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
          Выбери упражнение, чтобы посмотреть программу
          и начать тренировку.
        </p>
      </header>

      <section className="mt-7">
        <Exercises />
      </section>
    </main>
  );
}