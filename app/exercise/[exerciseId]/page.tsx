// app/exercise/[exerciseId]/page.tsx
import { redirect } from "next/navigation";

import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import MaxRepsForm from "@/app/components/MaxRepsForm";
import TrainingWeekCard from "@/app/components/TrainingWeekCard";
import ActiveWorkoutCard from "@/app/components/ActiveWorkoutCard";

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
    redirect("/training");
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

  if (maxReps === null) {
    return (
      <main
        className="
        flex
        h-[calc(100dvh-165px)]
        min-h-0
        flex-col
        overflow-hidden
        px-5
        pb-3
        pt-6
      "
      >
        {/* HEADER */}
        <header className="shrink-0 text-center">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--muted)" }}
          >
            Первоначальный замер
          </p>

          <h1
            className="
            text-[34px]
            font-bold
            leading-none
            tracking-[-0.05em]
            sm:text-[40px]
          "
            style={{ color: "var(--foreground)" }}
          >
            {exercise.name}
          </h1>

          <p
            className="
            mx-auto
            mt-3
            max-w-[320px]
            text-[15px]
            leading-6
          "
            style={{ color: "var(--muted)" }}
          >
            Укажи максимум повторений за один подход
          </p>
        </header>

        {/* FORM */}
        <section className="min-h-0 flex-1">
          <MaxRepsForm exerciseId={exercise.id} />
        </section>
      </main>
    );
  }

  const workouts = await prisma.workout.findMany({
    where: {
      userId: user.id,
      exerciseId: exercise.id,
    },
    include: {
      trainingWeek: true,
      sets: {
        orderBy: {
          setNumber: "asc",
        },
      },
    },
    orderBy: [
      {
        trainingWeek: {
          weekNumber: "asc",
        },
      },
      {
        workoutNumber: "asc",
      },
    ],
  });

  const activeWorkout =
    workouts.find((workout) => workout.status === "IN_PROGRESS") ?? null;

  const weeks = new Map<
    string,
    {
      weekNumber: number;
      workouts: typeof workouts;
    }
  >();

  for (const workout of workouts) {
    const weekId = workout.trainingWeekId;

    if (!weeks.has(weekId)) {
      weeks.set(weekId, {
        weekNumber: workout.trainingWeek.weekNumber,
        workouts: [],
      });
    }

    weeks.get(weekId)!.workouts.push(workout);
  }

  const weekList = Array.from(weeks.values());

  return (
    <main>
      {/* Header */}
      <header className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--muted)" }}
            >
              Упражнение
            </p>

            <h1
              className="truncate text-[30px] font-bold leading-none tracking-[-0.045em]"
              style={{ color: "var(--foreground)" }}
            >
              {exercise.name}
            </h1>
          </div>

          <div className="shrink-0 text-right">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--muted)" }}
            >
              Твой максимум
            </div>

            <div className="mt-1 flex items-baseline justify-end gap-1.5">
              <span
                className="text-[24px] font-bold leading-none tracking-[-0.04em]"
                style={{ color: "var(--foreground)" }}
              >
                {maxReps}
              </span>

              <span
                className="text-xs font-medium"
                style={{ color: "var(--muted)" }}
              >
                раз
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Active workout */}
      {activeWorkout && (
        <section className="mt-7">
          <ActiveWorkoutCard
            workoutId={activeWorkout.id}
            workoutNumber={activeWorkout.workoutNumber}
            sets={activeWorkout.sets}
          />
        </section>
      )}

      {/* Training plan */}
      <section className={activeWorkout ? "mt-10" : "mt-8"}>
        <div className="mt-5 space-y-7">
          {weekList.map((week) => (
            <TrainingWeekCard
              key={week.weekNumber}
              weekNumber={week.weekNumber}
              workouts={week.workouts}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
