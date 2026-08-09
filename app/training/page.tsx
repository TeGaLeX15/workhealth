import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";
import Exercises from "../components/Exercises";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pt-8">
      <header>
        <p className="text-sm font-medium text-green-600">
          Тренировки
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
          Выбери упражнение
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          Выбери упражнение, чтобы посмотреть программу
          и начать тренировку.
        </p>
      </header>

      <section className="mt-8">
        <Exercises />
      </section>
    </div>
  );
}