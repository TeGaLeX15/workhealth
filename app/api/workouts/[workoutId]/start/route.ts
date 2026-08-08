import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

export async function POST(
  request: Request,
  { params }: {
    params: Promise<{ workoutId: string }>;
  },
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 },
      );
    }

    const { workoutId } = await params;

    const workout =
      await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId: user.id,
        },
      });

    if (!workout) {
      return NextResponse.json(
        { error: "Тренировка не найдена" },
        { status: 404 },
      );
    }

    if (workout.status !== "PLANNED") {
      return NextResponse.json(
        {
          error:
            "Тренировка уже начата или завершена",
        },
        { status: 400 },
      );
    }

    const updatedWorkout =
      await prisma.workout.update({
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
    console.error(
      "Workout start error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не удалось начать тренировку",
      },
      { status: 500 },
    );
  }
}