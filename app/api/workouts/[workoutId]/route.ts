// app/api/workouts/[workoutId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workoutId: string }>;
  },
) {
  try {
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

    const { workoutId } = await params;

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

    return NextResponse.json({
      workout,
    });
  } catch (error) {
    console.error("Workout GET error:", error);

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
