// app/api/workouts/[workoutId]/start/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

import {
  dateStringToUtcDate,
  getLocalDateString,
} from "@/app/lib/timezone/local-date";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      workoutId: string;
    }>;
  },
) {
  try {
    // ─── Authentication ────────────────────────────────────────────

    const user = await getSessionUser();

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

    // ─── Params ────────────────────────────────────────────────────

    const { workoutId } = await params;

    if (!workoutId) {
      return NextResponse.json(
        {
          error: "Некорректный идентификатор тренировки",
        },
        {
          status: 400,
        },
      );
    }

    // ─── Workout ───────────────────────────────────────────────────

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId: user.id,
      },
    });

    if (!workout) {
      return NextResponse.json(
        {
          error: "Тренировка не найдена",
        },
        {
          status: 404,
        },
      );
    }

    // ─── Status ────────────────────────────────────────────────────

    if (workout.status !== "PLANNED") {
      return NextResponse.json(
        {
          error:
            workout.status === "IN_PROGRESS"
              ? "Тренировка уже начата"
              : "Эту тренировку нельзя начать",
          code: "WORKOUT_ALREADY_STARTED",
        },
        {
          status: 400,
        },
      );
    }

    // ─── Current local date ────────────────────────────────────────

    const todayString = getLocalDateString(new Date(), user.timezone);

    const today = dateStringToUtcDate(todayString);

    // ─── Missed workout ────────────────────────────────────────────

    if (workout.scheduledDate < today) {
      await prisma.workout.update({
        where: {
          id: workout.id,
        },
        data: {
          status: "SKIPPED",
        },
      });

      return NextResponse.json(
        {
          error: "Эта тренировка была пропущена",
          code: "WORKOUT_SKIPPED",
        },
        {
          status: 409,
        },
      );
    }

    // ─── Future workout ────────────────────────────────────────────

    if (workout.scheduledDate > today) {
      return NextResponse.json(
        {
          error: "Эта тренировка ещё не наступила",
          code: "WORKOUT_NOT_TODAY",
        },
        {
          status: 409,
        },
      );
    }

    // ─── Sequential training check ────────────────────────────────

    const previousUnfinishedWorkout = await prisma.workout.findFirst({
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

    if (previousUnfinishedWorkout) {
      return NextResponse.json(
        {
          error: "Сначала необходимо завершить предыдущую тренировку",
          code: "PREVIOUS_WORKOUT_NOT_COMPLETED",
        },
        {
          status: 409,
        },
      );
    }

    // ─── Start workout ─────────────────────────────────────────────

    const updatedWorkout = await prisma.workout.update({
      where: {
        id: workout.id,
      },

      data: {
        status: "IN_PROGRESS",
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

    return NextResponse.json({
      workout: updatedWorkout,
    });
  } catch (error) {
    console.error("Workout start error:", error);

    return NextResponse.json(
      {
        error: "Не удалось начать тренировку",
      },
      {
        status: 500,
      },
    );
  }
}
