import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getCurrentUser } from "@/app/server/auth/session";

type RouteContext = {
  params: Promise<{
    exerciseId: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 },
      );
    }

    const { exerciseId } = await context.params;

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

    const userExercise = await prisma.userExercise.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exercise.id,
        },
      },
    });

    return NextResponse.json({
      exercise: {
        id: exercise.id,
        name: exercise.name,
        slug: exercise.slug,
      },
      maxReps: userExercise?.maxReps ?? null,
    });
  } catch (error) {
    console.error("Exercise GET error:", error);

    return NextResponse.json(
      { error: "Не удалось получить упражнение" },
      { status: 500 },
    );
  }
}