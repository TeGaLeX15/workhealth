import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";
import { isSupportedExercise } from "@/app/lib/training/generate-workout";
import { generateTrainingWeek } from "@/app/lib/training/generate-training-week";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const exerciseId =
      typeof body.exerciseId === "string"
        ? body.exerciseId
        : "";

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

    const userExercise =
      await prisma.userExercise.findUnique({
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
          error:
            "Сначала необходимо установить максимум для упражнения",
        },
        { status: 400 },
      );
    }

    const maxReps = userExercise.maxReps;

    /*
     * Если активная неделя уже существует,
     * не создаём вторую.
     */
    const existingWeek =
      await prisma.trainingWeek.findFirst({
        where: {
          userId: user.id,
          exerciseId: exercise.id,
          status: "ACTIVE",
        },
        include: {
          workouts: {
            orderBy: {
              workoutNumber: "asc",
            },
          },
        },
      });

    if (existingWeek) {
      const firstWorkout =
        existingWeek.workouts[0];

      if (!firstWorkout) {
        return NextResponse.json(
          {
            error:
              "Активная неделя существует, но в ней нет тренировок",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          trainingWeekId: existingWeek.id,
          workoutId: firstWorkout.id,
        },
        { status: 200 },
      );
    }

    /*
     * Определяем номер следующей недели.
     */
    const lastWeek =
      await prisma.trainingWeek.findFirst({
        where: {
          userId: user.id,
          exerciseId: exercise.id,
        },
        orderBy: {
          weekNumber: "desc",
        },
      });

    const weekNumber =
      (lastWeek?.weekNumber ?? 0) + 1;

    /*
     * Генерируем структуру недели.
     */
    const generatedWeek =
      generateTrainingWeek(
        exercise.slug,
        maxReps,
      );

    /*
     * Создаём всю неделю одной транзакцией.
     */
    const result =
      await prisma.$transaction(async (tx) => {
        const trainingWeek =
          await tx.trainingWeek.create({
            data: {
              userId: user.id,
              exerciseId: exercise.id,
              weekNumber,
              maxReps,
              status: "ACTIVE",
            },
          });

        for (const generatedWorkout of generatedWeek.workouts) {
          await tx.workout.create({
            data: {
              trainingWeekId: trainingWeek.id,
              userId: user.id,
              exerciseId: exercise.id,
              workoutNumber:
                generatedWorkout.workoutNumber,

              /*
               * Новая тренировка ещё не начата.
               * Prisma также имеет PLANNED как default.
               */
              status: "PLANNED",

              sets: {
                create:
                  generatedWorkout.sets.map(
                    (set) => ({
                      setNumber: set.setNumber,
                      targetReps: set.targetReps,
                    }),
                  ),
              },
            },
          });
        }

        const workouts =
          await tx.workout.findMany({
            where: {
              trainingWeekId:
                trainingWeek.id,
            },
            orderBy: {
              workoutNumber: "asc",
            },
          });

        return {
          trainingWeek,
          workouts,
        };
      });

    const firstWorkout =
      result.workouts[0];

    if (!firstWorkout) {
      throw new Error(
        "Не удалось создать первую тренировку",
      );
    }

    return NextResponse.json(
      {
        trainingWeek: result.trainingWeek,
        workoutId: firstWorkout.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Training week POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не удалось создать программу тренировок",
      },
      { status: 500 },
    );
  }
}