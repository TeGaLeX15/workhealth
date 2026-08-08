import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

type RouteContext = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export async function PUT(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 },
      );
    }

    const { exerciseId } = await context.params;

    const body = await request.json();

    const maxReps =
      typeof body.maxReps === "number"
        ? body.maxReps
        : Number(body.maxReps);

    if (!Number.isInteger(maxReps) || maxReps <= 0) {
      return NextResponse.json(
        {
          error: "Максимум должен быть целым числом больше нуля",
        },
        { status: 400 },
      );
    }

    if (maxReps > 1000) {
      return NextResponse.json(
        {
          error: "Слишком большое значение максимума",
        },
        { status: 400 },
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Упражнение не найдено" },
        { status: 404 },
      );
    }

    const userExercise = await prisma.userExercise.upsert({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exercise.id,
        },
      },
      update: {
        maxReps,
        maxUpdatedAt: new Date(),
      },
      create: {
        userId: user.id,
        exerciseId: exercise.id,
        maxReps,
        maxUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      userExercise: {
        id: userExercise.id,
        exerciseId: userExercise.exerciseId,
        maxReps: userExercise.maxReps,
        maxUpdatedAt: userExercise.maxUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Exercise max PUT error:", error);

    return NextResponse.json(
      { error: "Не удалось сохранить максимум" },
      { status: 500 },
    );
  }
}