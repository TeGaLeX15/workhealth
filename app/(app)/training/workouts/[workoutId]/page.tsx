// app/(app)/workouts/[workoutId]/page.tsx
import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import CompletedWorkout from "@/app/components/workout/CompletedWorkout";
import PlannedWorkout from "@/app/components/workout/PlannedWorkout";
import WorkoutHeader from "@/app/components/workout/WorkoutHeader";
import WorkoutSession from "@/app/components/workout/WorkoutSession";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

/**
 * Страница отдельной тренировки BodyOS.
 *
 * Загружает тренировку пользователя, проверяет доступ к ней
 * и отображает соответствующий интерфейс в зависимости от её статуса:
 *
 * - PLANNED — запланированная тренировка;
 * - IN_PROGRESS — активная тренировка;
 * - COMPLETED — завершённая тренировка.
 *
 * Пропущенные, отменённые или заблокированные тренировки
 * перенаправляются обратно на страницу тренировок.
 */
export default async function WorkoutPage({ params }: WorkoutPageProps) {
  /* ==========================================================================
     AUTHENTICATION
     ========================================================================== */

  /**
   * Получает текущего авторизованного пользователя.
   *
   * Используется для ограничения доступа к тренировкам
   * только их владельцу.
   */
  const user = await requireCurrentUser();

  const { workoutId } = await params;

  /* ==========================================================================
     WORKOUT
     ========================================================================== */

  /**
   * Загружает тренировку пользователя вместе с упражнением,
   * тренировочной неделей и подходами.
   */
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

  /**
   * Если тренировка не существует или не принадлежит пользователю,
   * возвращаем его на страницу тренировок.
   */
  if (!workout) {
    redirect("/training");
  }

  /* ==========================================================================
     ACCESS CONTROL
     ========================================================================== */

  /**
   * Пропущенные и отменённые тренировки недоступны для открытия.
   */
  if (workout.status === "SKIPPED" || workout.status === "CANCELLED") {
    redirect("/training");
  }

  /**
   * Для запланированной тренировки проверяем,
   * нет ли более ранней незавершённой тренировки
   * этого же упражнения.
   *
   * Это предотвращает прохождение тренировок не по порядку.
   */
  if (workout.status === "PLANNED") {
    const blockingWorkout = await prisma.workout.findFirst({
      where: {
        userId: user.id,
        exerciseId: workout.exerciseId,
        status: {
          in: ["PLANNED", "IN_PROGRESS"],
        },
        OR: [
          {
            scheduledDate: {
              lt: workout.scheduledDate,
            },
          },
          {
            scheduledDate: workout.scheduledDate,
            workoutNumber: {
              lt: workout.workoutNumber,
            },
          },
        ],
      },
      orderBy: [
        {
          scheduledDate: "asc",
        },
        {
          workoutNumber: "asc",
        },
      ],
      select: {
        id: true,
      },
    });

    /**
     * Если существует более ранняя незавершённая тренировка,
     * текущая тренировка считается заблокированной.
     */
    if (blockingWorkout) {
      redirect("/training");
    }
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <main className="mx-auto w-full">
      {/* WORKOUT HEADER */}
      <WorkoutHeader workout={workout} />

      {/* PLANNED WORKOUT */}
      {workout.status === "PLANNED" && (
        <PlannedWorkout workout={workout} timeZone={user.timezone} />
      )}

      {/* ACTIVE WORKOUT */}
      {workout.status === "IN_PROGRESS" && (
        <section>
          <WorkoutSession workoutId={workout.id} sets={workout.sets} />
        </section>
      )}

      {/* COMPLETED WORKOUT */}
      {workout.status === "COMPLETED" && <CompletedWorkout workout={workout} />}
    </main>
  );
}
