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
    redirect("/");
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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-xl px-5 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 transition hover:text-white"
        >
          ← Назад
        </Link>

        <div className="mt-10">
          <p className="text-sm text-zinc-500">
            Упражнение
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {exercise.name}
          </h1>

          {maxReps === null ? (
            <MaxRepsForm
              exerciseId={exercise.id}
              exerciseName={exercise.name}
            />
          ) : (
            <>
              {/* Максимум */}
              <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-sm text-zinc-500">
                  Твой текущий максимум
                </p>

                <p className="mt-2 text-4xl font-semibold">
                  {maxReps}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  повторений
                </p>
              </div>

              {/* Текущая программа */}
              {activeWeek && (
                <TrainingWeekCard
                  weekNumber={activeWeek.weekNumber}
                  workouts={activeWeek.workouts}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}