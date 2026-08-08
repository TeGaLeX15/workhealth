import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";
import Link from "next/link";
import MaxRepsForm from "@/app/components/MaxRepsForm";

type ExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExercisePage({ params }: ExercisePageProps) {
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

  const userExercise = await prisma.userExercise.findUnique({
    where: {
      userId_exerciseId: {
        userId: user.id,
        exerciseId: exercise.id,
      },
    },
  });

  const maxReps = userExercise?.maxReps ?? null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-md px-6 py-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          ← Назад
        </Link>

        <div className="mt-10">
          <p className="text-sm text-zinc-500">Упражнение</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {exercise.name}
          </h1>

          {maxReps === null ? (
            <MaxRepsForm
              exerciseId={exercise.id}
              exerciseName={exercise.name}
            />
          ) : (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-500">Твой текущий максимум</p>

              <p className="mt-2 text-4xl font-semibold">{maxReps}</p>

              <p className="mt-1 text-sm text-zinc-500">повторений</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
