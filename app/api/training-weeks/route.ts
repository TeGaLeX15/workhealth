// app/api/training-weeks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/server/db";
import { getSessionUser } from "@/app/server/auth/session";
import { isSupportedExercise } from "@/app/lib/training/generate-workout";
import { generateTrainingWeek } from "@/app/lib/training/generate-training-week";

function getTodayInTimeZone(timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === "year")?.value);

  const month = Number(parts.find((part) => part.type === "month")?.value);

  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(
      `Не удалось определить текущую дату для timezone "${timeZone}"`,
    );
  }

  return new Date(Date.UTC(year, month - 1, day));
}

function isSameCalendarDay(first: Date, second: Date): boolean {
  return first.getTime() === second.getTime();
}

export async function POST(request: Request) {
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

    /*
     * Проверяем упражнение.
     */
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        {
          error: "Упражнение не найдено",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Проверяем поддержку генерации.
     */
    if (!isSupportedExercise(exercise.slug)) {
      return NextResponse.json(
        {
          error:
            "Для этого упражнения генерация тренировки пока не поддерживается",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Получаем максимум пользователя.
     */
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
        {
          status: 400,
        },
      );
    }

    const maxReps = userExercise.maxReps;

    /*
     * Используем timezone пользователя.
     *
     * Например:
     *
     * Asia/Almaty
     * Europe/Moscow
     * America/New_York
     */
    const timeZone = user.timezone || "Asia/Almaty";

    const today = getTodayInTimeZone(timeZone);

    /*
     * Ищем активную неделю
     * именно этого упражнения.
     */
    const existingWeek = await prisma.trainingWeek.findFirst({
      where: {
        userId: user.id,
        exerciseId: exercise.id,
        status: "ACTIVE",
      },

      include: {
        workouts: {
          orderBy: {
            scheduledDate: "asc",
          },
        },
      },
    });

    /*
     * Если активная неделя существует —
     * используем её.
     */
    if (existingWeek) {
      /*
       * 1. Сначала ищем тренировку сегодня.
       */
      const todayWorkout = existingWeek.workouts.find((workout) => {
        const workoutDate = new Date(workout.scheduledDate);

        return (
          isSameCalendarDay(workoutDate, today) &&
          workout.status !== "COMPLETED" &&
          workout.status !== "CANCELLED"
        );
      });

      if (todayWorkout) {
        return NextResponse.json(
          {
            trainingWeek: existingWeek,

            workouts: existingWeek.workouts,

            trainingWeekId: existingWeek.id,

            workoutId: todayWorkout.id,
          },
          {
            status: 200,
          },
        );
      }

      /*
       * 2. Если сегодня тренировки нет —
       * ищем ближайшую будущую.
       */
      const upcomingWorkout = existingWeek.workouts.find((workout) => {
        const workoutDate = new Date(workout.scheduledDate);

        return (
          workoutDate.getTime() > today.getTime() &&
          workout.status !== "COMPLETED" &&
          workout.status !== "CANCELLED"
        );
      });

      if (upcomingWorkout) {
        return NextResponse.json(
          {
            trainingWeek: existingWeek,

            workouts: existingWeek.workouts,

            trainingWeekId: existingWeek.id,

            workoutId: upcomingWorkout.id,
          },
          {
            status: 200,
          },
        );
      }

      /*
       * 3. Будущих тренировок нет.
       *
       * Значит пользователь мог пропустить
       * тренировку в прошлом.
       *
       * Возвращаем первую незавершённую.
       */
      const unfinishedWorkout = existingWeek.workouts.find(
        (workout) =>
          workout.status !== "COMPLETED" && workout.status !== "CANCELLED",
      );

      if (unfinishedWorkout) {
        return NextResponse.json(
          {
            trainingWeek: existingWeek,

            workouts: existingWeek.workouts,

            trainingWeekId: existingWeek.id,

            workoutId: unfinishedWorkout.id,
          },
          {
            status: 200,
          },
        );
      }

      /*
       * 4. Все тренировки недели
       * завершены или отменены.
       *
       * Закрываем неделю.
       */
      await prisma.trainingWeek.update({
        where: {
          id: existingWeek.id,
        },

        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    }

    /*
     * Определяем номер следующей недели.
     */
    const lastWeek = await prisma.trainingWeek.findFirst({
      where: {
        userId: user.id,
        exerciseId: exercise.id,
      },

      orderBy: {
        weekNumber: "desc",
      },
    });

    const weekNumber = (lastWeek?.weekNumber ?? 0) + 1;

    /*
     * Генерируем новую неделю
     * в timezone пользователя.
     */
    const generatedWeek = generateTrainingWeek(
      exercise.slug,
      maxReps,
      new Date(),
      timeZone,
    );

    /*
     * Создаём неделю и все тренировки
     * одной транзакцией.
     */
    const result = await prisma.$transaction(async (tx) => {
      const trainingWeek = await tx.trainingWeek.create({
        data: {
          userId: user.id,
          exerciseId: exercise.id,

          weekNumber,

          maxReps,

          startDate: generatedWeek.startDate,

          endDate: generatedWeek.endDate,

          status: "ACTIVE",
        },
      });

      for (const generatedWorkout of generatedWeek.workouts) {
        await tx.workout.create({
          data: {
            trainingWeekId: trainingWeek.id,

            userId: user.id,

            exerciseId: exercise.id,

            workoutNumber: generatedWorkout.workoutNumber,

            scheduledDate: generatedWorkout.scheduledDate,

            status: "PLANNED",

            sets: {
              create: generatedWorkout.sets.map((set) => ({
                setNumber: set.setNumber,

                targetReps: set.targetReps,
              })),
            },
          },
        });
      }

      const workouts = await tx.workout.findMany({
        where: {
          trainingWeekId: trainingWeek.id,
        },

        orderBy: {
          scheduledDate: "asc",
        },
      });

      return {
        trainingWeek,
        workouts,
      };
    });

    const firstWorkout = result.workouts[0];

    if (!firstWorkout) {
      throw new Error("Не удалось создать первую тренировку");
    }

    return NextResponse.json(
      {
        trainingWeek: result.trainingWeek,

        workouts: result.workouts,

        trainingWeekId: result.trainingWeek.id,

        workoutId: firstWorkout.id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Training week POST error:", error);

    return NextResponse.json(
      {
        error: "Не удалось создать программу тренировок",
      },
      {
        status: 500,
      },
    );
  }
}
