// app/(app)/exercise/[exerciseId]/page.tsx
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";
import {
  dateStringToUtcDate,
  getLocalDateString,
} from "@/app/lib/timezone/local-date";

import MaxRepsForm from "@/app/components/exercises/max-reps/MaxRepsForm";
import TrainingWeekCard from "@/app/components/TrainingWeekCard";
import ActiveWorkoutCard from "@/app/components/workout/ActiveWorkoutCard";

type ExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export default async function ExercisePage({ params }: ExercisePageProps) {
  const user = await requireCurrentUser();

  const { exerciseId } = await params;

  // ─── Exercise ────────────────────────────────────────────────────────────
  const exercise = await prisma.exercise.findUnique({
    where: {
      id: exerciseId,
    },
  });

  if (!exercise) {
    redirect("/training");
  }

  // ─── User exercise ───────────────────────────────────────────────────────
  const userExercise = await prisma.userExercise.findUnique({
    where: {
      userId_exerciseId: {
        userId: user.id,
        exerciseId: exercise.id,
      },
    },
  });

  const maxReps = userExercise?.maxReps ?? null;

  // ─── Initial max reps ────────────────────────────────────────────────────
  if (maxReps === null) {
    return (
      <main className="px-4 pb-8 pt-8">
        <header className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{
              color: "var(--accent)",
            }}
          >
            Первоначальный замер
          </p>

          <h1
            className="
              mt-2
              text-[32px]
              font-bold
              leading-none
              tracking-[-0.05em]
              sm:text-[38px]
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
              mt-3
              max-w-[300px]
              text-[14px]
              leading-5
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Выполни один подход до максимума и укажи количество повторений.
          </p>
        </header>

        <section className="mx-auto mt-10 w-full max-w-[420px]">
          <MaxRepsForm exerciseId={exercise.id} />
        </section>

        <p
          className="
            mx-auto
            mt-7
            max-w-[300px]
            text-center
            text-[12px]
            leading-5
          "
          style={{
            color: "var(--muted)",
          }}
        >
          Не нужно угадывать. Укажи результат своего реального максимального
          подхода.
        </p>
      </main>
    );
  }

  // ─── Current local date ──────────────────────────────────────────────────
  const todayString = getLocalDateString(new Date(), user.timezone);

  const today = dateStringToUtcDate(todayString);

  // ─── Sync missed workouts ────────────────────────────────────────────────
  await prisma.workout.updateMany({
    where: {
      userId: user.id,
      exerciseId: exercise.id,
      scheduledDate: {
        lt: today,
      },
      status: "PLANNED",
    },
    data: {
      status: "SKIPPED",
    },
  });

  // ─── Training data ───────────────────────────────────────────────────────
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
        scheduledDate: "asc",
      },
      {
        workoutNumber: "asc",
      },
    ],
  });

  // ─── Current workout ─────────────────────────────────────────────────────
  const currentWorkout =
    workouts.find(
      (workout) =>
        workout.status === "IN_PROGRESS" || workout.status === "PLANNED",
    ) ?? null;

  // ─── Active workout ──────────────────────────────────────────────────────
  const activeWorkout =
    workouts.find((workout) => workout.status === "IN_PROGRESS") ?? null;

  // ─── Group workouts by training week ─────────────────────────────────────
  const weeks = new Map<
    string,
    {
      weekNumber: number;
      startDate: Date;
      endDate: Date;
      workouts: typeof workouts;
    }
  >();

  for (const workout of workouts) {
    const weekId = workout.trainingWeekId;

    if (!weeks.has(weekId)) {
      weeks.set(weekId, {
        weekNumber: workout.trainingWeek.weekNumber,
        startDate: workout.trainingWeek.startDate,
        endDate: workout.trainingWeek.endDate,
        workouts: [],
      });
    }

    weeks.get(weekId)!.workouts.push(workout);
  }

  const weekList = Array.from(weeks.values()).sort(
    (a, b) => a.weekNumber - b.weekNumber,
  );

  // ─── Exercise page ───────────────────────────────────────────────────────
  return (
    <main>
      {/* Header */}
      <header className="text-center">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.12em]
          "
          style={{
            color: "var(--muted)",
          }}
        >
          Упражнение
        </p>

        <h1
          className="
            mx-auto
            mt-2
            max-w-[22rem]
            text-[32px]
            font-bold
            leading-[1.02]
            tracking-[-0.05em]
            sm:text-[36px]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          {exercise.name}
        </h1>

        <div
          className="
            mx-auto
            mt-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-4
            py-2.5
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 7%, var(--card))",
            borderColor: "color-mix(in srgb, var(--accent) 18%, var(--border))",
          }}
        >
          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.1em]
            "
            style={{
              color: "var(--accent)",
            }}
          >
            Личный рекорд
          </span>

          <span
            className="h-1 w-1 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
            }}
          />

          <span
            className="
              text-[18px]
              font-bold
              leading-none
              tracking-[-0.03em]
              tabular-nums
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {maxReps}
          </span>

          <span
            className="text-[11px] font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            раз
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

      {/* Training plan */}
      <section className={activeWorkout ? "mt-10" : "mt-8"}>
        <div className="space-y-7">
          {weekList.map((week) => (
            <TrainingWeekCard
              key={week.weekNumber}
              weekNumber={week.weekNumber}
              startDate={week.startDate}
              endDate={week.endDate}
              workouts={week.workouts}
              currentWorkoutId={currentWorkout?.id ?? null}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
