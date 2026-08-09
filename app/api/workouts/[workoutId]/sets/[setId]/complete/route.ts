import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

type RouteContext = {
  params: Promise<{
    workoutId: string;
    setId: string;
  }>;
};

export async function POST(
  _request: Request,
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

    const { workoutId, setId } = await context.params;

    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId: user.id,
      },
      include: {
        sets: {
          orderBy: {
            setNumber: "asc",
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Тренировка не найдена" },
        { status: 404 },
      );
    }

    if (workout.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Тренировка не начата" },
        { status: 400 },
      );
    }

    const currentSet = workout.sets.find(
      (set) => set.id === setId,
    );

    if (!currentSet) {
      return NextResponse.json(
        { error: "Подход не найден" },
        { status: 404 },
      );
    }

    if (currentSet.completed) {
      return NextResponse.json(
        { error: "Этот подход уже выполнен" },
        { status: 400 },
      );
    }

    const updatedSet = await prisma.workoutSet.update({
      where: {
        id: setId,
      },
      data: {
        completed: true,
        actualReps: currentSet.targetReps,
        completedAt: new Date(),
      },
    });

    const remainingSets = workout.sets.filter(
      (set) =>
        set.id !== setId &&
        !set.completed,
    );

    let updatedWorkout;

    if (remainingSets.length === 0) {
      updatedWorkout = await prisma.workout.update({
        where: {
          id: workout.id,
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    } else {
      updatedWorkout = workout;
    }

    return NextResponse.json({
      set: updatedSet,
      workout: updatedWorkout,
      completed: remainingSets.length === 0,
    });
  } catch (error) {
    console.error(
      "Complete workout set error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Не удалось сохранить подход",
      },
      { status: 500 },
    );
  }
}