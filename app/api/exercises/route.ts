// app/api/exercises/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/app/server/db";
import { getCurrentUser } from "@/app/server/auth/session";

/**
 * Возвращает список упражнений с персональными результатами пользователя.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const exercises = await prisma.exercise.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        userExercises: {
          where: {
            userId: user.id,
          },
          select: {
            maxReps: true,
            maxUpdatedAt: true,
          },
        },
      },
    });

    const result = exercises.map((exercise) => {
      const userExercise = exercise.userExercises[0];

      return {
        id: exercise.id,
        name: exercise.name,
        slug: exercise.slug,
        maxReps: userExercise?.maxReps ?? null,
        maxUpdatedAt: userExercise?.maxUpdatedAt ?? null,
      };
    });

    return NextResponse.json({
      exercises: result,
    });
  } catch (error) {
    console.error("Exercises GET error:", error);

    return NextResponse.json(
      { error: "Не удалось получить упражнения" },
      { status: 500 },
    );
  }
}
