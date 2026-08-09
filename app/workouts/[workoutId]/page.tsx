import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";
import WorkoutSession from "@/app/components/WorkoutSession";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({
  params,
}: WorkoutPageProps) {
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-xl px-5 py-6">
        <Link
          href={`/exercise/${workout.exerciseId}`}
          className="text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          ← Назад
        </Link>

        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-500">
            Неделя {workout.trainingWeek.weekNumber}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Тренировка {workout.workoutNumber}
          </h1>

          <p className="mt-2 text-lg text-zinc-400">
            {workout.exercise.name}
          </p>
        </div>

        {workout.status === "PLANNED" && (
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
            <p className="text-zinc-300">
              Сначала начни тренировку
            </p>

            <form
              action={`/api/workouts/${workout.id}/start`}
              method="POST"
              className="mt-5"
            >
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Начать тренировку
              </button>
            </form>
          </div>
        )}

        {workout.status === "IN_PROGRESS" && (
          <WorkoutSession
            workoutId={workout.id}
            sets={workout.sets}
          />
        )}

        {workout.status === "COMPLETED" && (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
              <div>
                <p className="text-6xl font-semibold">
                  ✓
                </p>

                <p className="mt-4 text-sm text-zinc-400">
                  Тренировка завершена
                </p>
              </div>
            </div>
          </div>
        )}

        {workout.status === "CANCELLED" && (
          <div className="mt-12 rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-center text-red-300">
            Тренировка отменена
          </div>
        )}
      </div>
    </main>
  );
}