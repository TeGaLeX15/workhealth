// app/(app)/training/page.tsx
import PageHeader from "@/app/components/app/PageHeader";
import Exercises from "@/app/components/exercises/Exercises";
import { requireCurrentUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

/**
 * Страница выбора упражнения для тренировки.
 *
 * Загружает список доступных упражнений и персональные показатели
 * текущего пользователя, после чего передаёт подготовленные данные
 * в компонент списка упражнений.
 */
export default async function TrainingPage() {
  /* ==========================================================================
     AUTHENTICATION
     ========================================================================== */

  /**
   * Получает текущего авторизованного пользователя.
   *
   * Если пользователь не авторизован, requireCurrentUser()
   * самостоятельно обрабатывает перенаправление.
   */
  const user = await requireCurrentUser();

  /* ==========================================================================
     DATA
     ========================================================================== */

  /**
   * Загружает упражнения и персональные показатели пользователя.
   *
   * userExercises фильтруется по текущему пользователю, чтобы вместе
   * с упражнением получить только его максимальный результат.
   */
  const exercises = await prisma.exercise.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
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

  /* ==========================================================================
     VIEW DATA
     ========================================================================== */

  /**
   * Преобразует данные Prisma в компактную структуру,
   * необходимую компоненту Exercises.
   *
   * Если пользователь ещё не имеет персонального результата,
   * maxReps и maxUpdatedAt остаются null.
   */
  const exerciseData = exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    slug: exercise.slug,
    maxReps: exercise.userExercises[0]?.maxReps ?? null,
    maxUpdatedAt:
      exercise.userExercises[0]?.maxUpdatedAt?.toISOString() ?? null,
  }));

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <>
      {/* PAGE HEADER */}
      <PageHeader
        eyebrow="Тренировки"
        title="Выбери упражнение"
        description="Выбери упражнение, чтобы открыть программу"
      />

      {/* EXERCISES */}
      <section>
        <Exercises exercises={exerciseData} />
      </section>
    </>
  );
}
