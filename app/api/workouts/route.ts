import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";

import {
  generateWorkout,
  isSupportedExercise,
} from "@/app/lib/training/generate-workout";

import type { ExerciseSlug } from "@/app/lib/training/types";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();

    const exerciseId =
      typeof body.exerciseId === "string" ? body.exerciseId : "";

    if (!exerciseId) {
      return NextResponse.json(
        { error: "Не указано упражнение" },
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

    if (!isSupportedExercise(exercise.slug)) {
      return NextResponse.json(
        {
          error:
            "Для этого упражнения генерация тренировки пока не поддерживается",
        },
        { status: 400 },
      );
    }

    const exerciseSlug: ExerciseSlug = exercise.slug;

    const userExercise = await prisma.userExercise.findUnique({
      where: {
        userId_exerciseId: {
          userId: user.id,
          exerciseId: exercise.id,
        },
      },
    });

    if (!userExercise || userExercise.maxReps === null) {
      return NextResponse.json(
        {
          error: "Сначала необходимо установить максимум для упражнения",
        },
        { status: 400 },
      );
    }

    const maxReps = userExercise.maxReps;

    const workout = await prisma.$transaction(async (tx) => {
      let trainingWeek = await tx.trainingWeek.findFirst({
        where: {
          userId: user.id,
          exerciseId: exercise.id,
          status: "ACTIVE",
        },
        orderBy: {
          weekNumber: "desc",
        },
      });

      if (!trainingWeek) {
        const lastTrainingWeek = await tx.trainingWeek.findFirst({
          where: {
            userId: user.id,
            exerciseId: exercise.id,
          },
          orderBy: {
            weekNumber: "desc",
          },
        });

        const nextWeekNumber = (lastTrainingWeek?.weekNumber ?? 0) + 1;

        trainingWeek = await tx.trainingWeek.create({
          data: {
            userId: user.id,
            exerciseId: exercise.id,
            weekNumber: nextWeekNumber,
            maxReps,
            status: "ACTIVE",
          },
        });
      }

      const lastWorkout = await tx.workout.findFirst({
        where: {
          trainingWeekId: trainingWeek.id,
        },
        orderBy: {
          workoutNumber: "desc",
        },
      });

      const workoutNumber = (lastWorkout?.workoutNumber ?? 0) + 1;

      const generatedWorkout = generateWorkout(
        exerciseSlug,
        trainingWeek.maxReps,
      );

      return tx.workout.create({
        data: {
          trainingWeekId: trainingWeek.id,
          userId: user.id,
          exerciseId: exercise.id,
          workoutNumber,
          status: "PLANNED",

          sets: {
            create: generatedWorkout.sets.map((set) => ({
              setNumber: set.setNumber,
              targetReps: set.targetReps,
            })),
          },
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
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error("Workout POST error:", error);

    return NextResponse.json(
      {
        error: "Не удалось создать тренировку",
      },
      { status: 500 },
    );
  }
}
