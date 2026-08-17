// app/(app)/training/page.tsx
import PageHeader from "@/app/components/app/PageHeader";
import Exercises from "@/app/components/exercises/Exercises";
import { requireCurrentUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

export default async function TrainingPage() {
  const user = await requireCurrentUser();

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

  const exerciseData = exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    slug: exercise.slug,
    maxReps: exercise.userExercises[0]?.maxReps ?? null,
    maxUpdatedAt:
      exercise.userExercises[0]?.maxUpdatedAt?.toISOString() ?? null,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Тренировки"
        title="Выбери упражнение"
        description="Выбери упражнение, чтобы открыть программу"
      />

      <section>
        <Exercises exercises={exerciseData} />
      </section>
    </>
  );
}
