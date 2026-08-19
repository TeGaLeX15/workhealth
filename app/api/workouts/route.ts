// app/api/workouts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getCurrentUser } from "@/app/server/auth/session";

import {
  dateStringToUtcDate,
  getLocalDateString,
} from "@/app/lib/timezone/local-date";

/**
 * Возвращает доступную тренировку текущего пользователя.
 *
 * Обрабатывает пропущенные тренировки, определяет тренировку
 * на сегодня или ближайшую будущую и завершает тренировочную
 * неделю, если в ней больше нет активных тренировок.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Не авторизован",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const exerciseId =
      typeof body.exerciseId === "string" ? body.exerciseId : "";

    if (!exerciseId) {
      return NextResponse.json(
        {
          error: "Не указано упражнение",
        },
        {
          status: 400,
        },
      );
    }

    const todayString = getLocalDateString(new Date(), user.timezone);

    const today = dateStringToUtcDate(todayString);

    const trainingWeek = await prisma.trainingWeek.findFirst({
      where: {
        userId: user.id,
        exerciseId,
        status: "ACTIVE",
      },
      orderBy: {
        weekNumber: "desc",
      },
      include: {
        workouts: {
          orderBy: {
            scheduledDate: "asc",
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
        },
      },
    });

    if (!trainingWeek) {
      return NextResponse.json(
        {
          error: "Активная тренировочная неделя не найдена",
        },
        {
          status: 404,
        },
      );
    }

    const missedWorkouts = trainingWeek.workouts.filter(
      (workout) =>
        workout.scheduledDate < today && workout.status === "PLANNED",
    );

    if (missedWorkouts.length > 0) {
      await prisma.workout.updateMany({
        where: {
          id: {
            in: missedWorkouts.map((workout) => workout.id),
          },
          status: "PLANNED",
        },
        data: {
          status: "SKIPPED",
        },
      });
    }

    const workouts = await prisma.workout.findMany({
      where: {
        trainingWeekId: trainingWeek.id,
      },
      orderBy: {
        scheduledDate: "asc",
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

    const todayWorkout = workouts.find(
      (workout) =>
        workout.scheduledDate.getTime() === today.getTime() &&
        workout.status !== "COMPLETED" &&
        workout.status !== "CANCELLED" &&
        workout.status !== "SKIPPED",
    );

    if (todayWorkout) {
      return NextResponse.json({
        workout: todayWorkout,
        workouts,
        trainingWeek,
      });
    }

    const upcomingWorkout = workouts.find(
      (workout) =>
        workout.scheduledDate > today && workout.status === "PLANNED",
    );

    if (upcomingWorkout) {
      return NextResponse.json({
        workout: upcomingWorkout,
        workouts,
        trainingWeek,
      });
    }

    const hasActiveWorkouts = workouts.some(
      (workout) =>
        workout.status === "PLANNED" || workout.status === "IN_PROGRESS",
    );

    if (!hasActiveWorkouts) {
      await prisma.trainingWeek.update({
        where: {
          id: trainingWeek.id,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          error: "Все тренировки этой недели завершены",
          code: "TRAINING_WEEK_COMPLETED",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Для сегодняшнего дня нет доступной тренировки",
      },
      {
        status: 404,
      },
    );
  } catch (error) {
    console.error("Workout POST error:", error);

    return NextResponse.json(
      {
        error: "Не удалось получить тренировку",
      },
      {
        status: 500,
      },
    );
  }
}
