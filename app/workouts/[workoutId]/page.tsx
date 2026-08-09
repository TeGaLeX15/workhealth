import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";
import WorkoutSession from "@/app/components/WorkoutSession";
import StartWorkoutButton from "@/app/components/StartWorkoutButton";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { workoutId } = await params;

  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId: user.id,
    },
    include: {
      exercise: true,
      trainingWeek: true,
      sets: {
        orderBy: {
          setNumber: "asc",
        },
      },
    },
  });

  if (!workout) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-xl px-5 pb-10 pt-6">
        {/* Навигация */}
        <Link
          href={`/exercise/${workout.exerciseId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <span className="text-lg leading-none">←</span>

          <span>Назад</span>
        </Link>

        {/* Информация о тренировке */}
        <header className="mt-8 text-center">
          <p className="text-sm font-semibold text-emerald-600">
            Неделя {workout.trainingWeek.weekNumber}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
            Тренировка {workout.workoutNumber}
          </h1>

          <p className="mt-2 text-sm font-medium text-zinc-500">
            {workout.exercise.name}
          </p>
        </header>

        {/* Запланированная */}
        {workout.status === "PLANNED" && (
          <section className="mt-12">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <span className="text-2xl text-emerald-600">▶</span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-zinc-950">
                Готов к тренировке?
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                Выполни все подходы по программе. После каждого подхода будет
                отдых.
              </p>

              <div className="mt-6">
                <StartWorkoutButton workoutId={workout.id} />
              </div>
            </div>
          </section>
        )}

        {/* В процессе */}
        {workout.status === "IN_PROGRESS" && (
          <section className="mt-8">
            <WorkoutSession workoutId={workout.id} sets={workout.sets} />
          </section>
        )}

        {/* Завершена */}
        {workout.status === "COMPLETED" && (
          <section className="mt-12 flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-5xl font-semibold text-emerald-600">✓</span>
            </div>

            <h2 className="mt-7 text-2xl font-bold tracking-tight text-zinc-950">
              Тренировка завершена
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
              Все подходы выполнены.
            </p>

            <Link
              href={`/exercise/${workout.exerciseId}`}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              К программе
            </Link>
          </section>
        )}

        {/* Отменена */}
        {workout.status === "CANCELLED" && (
          <section className="mt-12">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl text-red-600">!</span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-red-950">
                Тренировка отменена
              </h2>

              <p className="mt-2 text-sm text-red-600">
                Эта тренировка больше недоступна.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
