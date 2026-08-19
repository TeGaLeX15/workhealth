// app/(app)/exercise/[exerciseId]/page.tsx
import { redirect } from "next/navigation";

import MaxRepsForm from "@/app/components/exercises/max-reps/MaxRepsForm";
import TrainingWeekCard from "@/app/components/TrainingWeekCard";
import ActiveWorkoutCard from "@/app/components/workout/ActiveWorkoutCard";
import {
  dateStringToUtcDate,
  getLocalDateString,
} from "@/app/lib/timezone/local-date";
import { requireCurrentUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

type ExercisePageProps = {
  params: Promise<{
    exerciseId: string;
  }>;
};

/**
 * Страница упражнения.
 *
 * Загружает упражнение и персональные данные пользователя,
 * синхронизирует пропущенные тренировки и отображает текущую
 * тренировку вместе с планом по тренировочным неделям.
 *
 * Если пользователь ещё не указал максимальное количество повторений,
 * вместо тренировочного плана отображается форма первоначального замера.
 */
export default async function ExercisePage({ params }: ExercisePageProps) {
  /* ==========================================================================
     AUTHENTICATION & ROUTE PARAMS
     ========================================================================== */

  /**
   * Получает текущего авторизованного пользователя и идентификатор упражнения.
   */
  const user = await requireCurrentUser();
  const { exerciseId } = await params;

  /* ==========================================================================
     EXERCISE
     ========================================================================== */

  /**
   * Загружает упражнение по идентификатору из URL.
   *
   * Если упражнение не существует, пользователь возвращается
   * к списку доступных упражнений.
   */
  const exercise = await prisma.exercise.findUnique({
    where: {
      id: exerciseId,
    },
  });

  if (!exercise) {
    redirect("/training");
  }

  /* ==========================================================================
     USER EXERCISE
     ========================================================================== */

  /**
   * Загружает персональные данные пользователя для этого упражнения.
   */
  const userExercise = await prisma.userExercise.findUnique({
    where: {
      userId_exerciseId: {
        userId: user.id,
        exerciseId: exercise.id,
      },
    },
  });

  const maxReps = userExercise?.maxReps ?? null;

  /* ==========================================================================
     INITIAL MAX REPS
     ========================================================================== */

  /**
   * Если пользователь ещё не проходил первоначальный замер,
   * показываем форму для сохранения его максимального результата.
   */
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

  /* ==========================================================================
     CURRENT DATE
     ========================================================================== */

  /**
   * Определяет текущую дату пользователя с учётом его часового пояса.
   *
   * Используется для определения тренировок, которые были запланированы
   * на прошлые даты, но ещё остались в статусе PLANNED.
   */
  const todayString = getLocalDateString(new Date(), user.timezone);
  const today = dateStringToUtcDate(todayString);

  /* ==========================================================================
     MISSED WORKOUTS
     ========================================================================== */

  /**
   * Помечает пропущенные запланированные тренировки как SKIPPED.
   *
   * Выполняется перед загрузкой тренировочного плана, чтобы
   * отображаемые данные сразу отражали актуальное состояние.
   */
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

  /* ==========================================================================
     TRAINING DATA
     ========================================================================== */

  /**
   * Загружает все тренировки упражнения вместе с тренировочными неделями
   * и подходами.
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
        scheduledDate: "asc",
      },
      {
        workoutNumber: "asc",
      },
    ],
  });

  /* ==========================================================================
     CURRENT WORKOUT
     ========================================================================== */

  /**
   * Определяет ближайшую активную или запланированную тренировку.
   */
  const currentWorkout =
    workouts.find(
      (workout) =>
        workout.status === "IN_PROGRESS" || workout.status === "PLANNED",
    ) ?? null;

  /**
   * Определяет тренировку, которая выполняется прямо сейчас.
   */
  const activeWorkout =
    workouts.find((workout) => workout.status === "IN_PROGRESS") ?? null;

  /* ==========================================================================
     TRAINING WEEKS
     ========================================================================== */

  /**
   * Группирует тренировки по тренировочным неделям.
   *
   * Map используется для формирования одной записи недели,
   * содержащей все связанные с ней тренировки.
   */
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

  /**
   * Преобразует сгруппированные недели в массив и сортирует
   * их по порядковому номеру.
   */
  const weekList = Array.from(weeks.values()).sort(
    (a, b) => a.weekNumber - b.weekNumber,
  );

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <main>
      {/* PAGE HEADER */}
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

      {/* ACTIVE WORKOUT */}
      {activeWorkout && (
        <section className="mt-7">
          <ActiveWorkoutCard
            workoutId={activeWorkout.id}
            workoutNumber={activeWorkout.workoutNumber}
            sets={activeWorkout.sets}
          />
        </section>
      )}

      {/* TRAINING PLAN */}
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
