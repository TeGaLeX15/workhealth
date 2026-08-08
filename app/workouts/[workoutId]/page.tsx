import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-xl px-4 py-6">
        <Link
          href={`/exercise/${workout.exerciseId}`}
          className="text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          ← Назад
        </Link>

        <div className="mt-10">
          <p className="text-sm text-zinc-500">
            Неделя {workout.trainingWeek.weekNumber}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Тренировка {workout.workoutNumber}
          </h1>

          <p className="mt-2 text-lg text-zinc-400">{workout.exercise.name}</p>
        </div>

        <div className="mt-8 space-y-3">
          {workout.sets.map((set) => (
            <div
              key={set.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4"
            >
              <div>
                <p className="text-sm text-zinc-500">Подход {set.setNumber}</p>

                <p className="mt-1 text-2xl font-semibold">{set.targetReps}</p>
              </div>

              <p className="text-sm text-zinc-500">повторений</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {workout.status === "PLANNED" && (
            <StartWorkoutButton workoutId={workout.id} />
          )}

          {workout.status === "IN_PROGRESS" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-sm text-zinc-400">
              Тренировка начата
            </div>
          )}

          {workout.status === "COMPLETED" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-sm text-zinc-400">
              Тренировка завершена
            </div>
          )}

          {workout.status === "CANCELLED" && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-center text-sm text-red-300">
              Тренировка отменена
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
