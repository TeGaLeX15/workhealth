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

  const userExercise = await prisma.userExercise.findUnique({
    where: {
      userId_exerciseId: {
        userId: user.id,
        exerciseId: exercise.id,
      },
    },
  });

  const maxReps = userExercise?.maxReps ?? null;

  /*
   * ─────────────────────────────────────────────
   * Первый замер
   * ─────────────────────────────────────────────
   */

  if (maxReps === null) {
    return (
      <main
        className="
          flex
          min-h-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* Верхняя часть */}
        <section className="shrink-0 pt-7 text-center">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
            "
            style={{
              color: "var(--accent)",
            }}
          >
            Настройка упражнения
          </p>

          <h1
            className="
              mt-2
              text-[clamp(26px,7vw,32px)]
              font-bold
              leading-tight
              tracking-[-0.045em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {exercise.name}
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-[300px]
              text-[13px]
              leading-5
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Укажи свой максимум повторений за один
            подход.
          </p>
        </section>

        {/* Центральная часть */}
        <section
          className="
            flex
            min-h-0
            flex-1
            items-center
            justify-center
          "
        >
          <MaxRepsForm
            exerciseId={exercise.id}
            previousMaxReps={null}
          />
        </section>
      </main>
    );
  }

  /*
   * ─────────────────────────────────────────────
   * Обычная страница упражнения
   * ─────────────────────────────────────────────
   */

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
    workouts.find(
      (workout) => workout.status === "IN_PROGRESS",
    ) ?? null;

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

  const totalWorkouts = workouts.length;

  return (
    <main>
      {/* Header */}
      <header className="mt-7">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.15em]
          "
          style={{
            color: "var(--muted)",
          }}
        >
          Тренировки
        </p>

        <h1
          className="
            mt-1.5
            text-[30px]
            font-bold
            leading-tight
            tracking-[-0.045em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          {exercise.name}
        </h1>

        <div className="mt-2.5 flex items-center gap-2">
          <span
            className="text-[12px]"
            style={{
              color: "var(--muted)",
            }}
          >
            Твой максимум
          </span>

          <span
            className="
              rounded-full
              px-2.5
              py-1
              text-[11px]
              font-semibold
            "
            style={{
              color: "var(--foreground)",
              backgroundColor:
                "color-mix(in srgb, var(--muted) 7%, var(--surface))",
            }}
          >
            {maxReps} повторений
          </span>
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

      {/* Program */}
      <section className={activeWorkout ? "mt-10" : "mt-8"}>
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Программа
            </p>

            <h2
              className="
                mt-1
                text-[20px]
                font-bold
                tracking-[-0.03em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Тренировочный план
            </h2>
          </div>

          <div
            className="
              shrink-0
              rounded-full
              px-3
              py-1.5
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--muted) 7%, var(--surface))",
            }}
          >
            <span
              className="
                text-[11px]
                font-semibold
              "
              style={{
                color: "var(--muted)",
              }}
            >
              {totalWorkouts}{" "}
              {totalWorkouts === 1
                ? "тренировка"
                : "тренировок"}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-5">
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