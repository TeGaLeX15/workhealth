import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import MaxRepsForm from "@/app/components/MaxRepsForm";
import TrainingWeekCard from "@/app/components/TrainingWeekCard";

type ExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExercisePage({
  params,
}: ExercisePageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { exerciseId } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: {
      id: exerciseId,
    },
  });

  if (!exercise) {
    redirect("/training");
  }

  const userExercise =
    await prisma.userExercise.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exercise.id,
        },
      },
    });

  const maxReps = userExercise?.maxReps ?? null;

  const activeWeek =
    maxReps !== null
      ? await prisma.trainingWeek.findFirst({
          where: {
            userId: user.id,
            exerciseId: exercise.id,
            status: "ACTIVE",
          },
          include: {
            workouts: {
              orderBy: {
                workoutNumber: "asc",
              },
              include: {
                sets: {
                  orderBy: {
                    setNumber: "asc",
                  },
                },
              },
            },
          },
        })
      : null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Навигация */}
      <div className="pt-6">
        <Link
          href="/training"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <span className="text-lg leading-none">←</span>
          <span>Тренировки</span>
        </Link>
      </div>

      {/* Заголовок */}
      <header className="mt-8">
        <p className="text-sm font-semibold text-emerald-600">
          Упражнение
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          {exercise.name}
        </h1>
      </header>

      {/* Максимум ещё не задан */}
      {maxReps === null ? (
        <section className="mt-8">
          <MaxRepsForm
            exerciseId={exercise.id}
            exerciseName={exercise.name}
          />
        </section>
      ) : (
        <div className="mt-8 space-y-10">
          {/* Максимум */}
          <section>
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50">
              <div className="px-6 pb-7 pt-6">
                <p className="text-sm font-medium text-zinc-500">
                  Твой текущий максимум
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tight text-zinc-950">
                    {maxReps}
                  </span>

                  <span className="text-sm font-medium text-zinc-500">
                    повторений
                  </span>
                </div>
              </div>

              <div className="h-1 bg-emerald-500" />
            </div>
          </section>

          {/* Программа */}
          {activeWeek && (
            <section>
              <div className="mb-5">
                <p className="text-sm font-semibold text-emerald-600">
                  Твоя программа
                </p>

                <div className="mt-1 flex items-end justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                    Неделя {activeWeek.weekNumber}
                  </h2>

                  <span className="pb-0.5 text-sm text-zinc-400">
                    {activeWeek.workouts.length}{" "}
                    {activeWeek.workouts.length === 1
                      ? "тренировка"
                      : "тренировки"}
                  </span>
                </div>
              </div>

              <TrainingWeekCard
                weekNumber={activeWeek.weekNumber}
                workouts={activeWeek.workouts}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}