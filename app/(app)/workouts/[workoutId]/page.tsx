import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import WorkoutHeader from "@/app/components/workout/WorkoutHeader";
import PlannedWorkout from "@/app/components/workout/PlannedWorkout";
import WorkoutSession from "@/app/components/workout/WorkoutSession";
import CompletedWorkout from "@/app/components/workout/CompletedWorkout";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { workoutId } = await params;

  // ─── Workout ───────────────────────────────────────────────────────────
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
    redirect("/training");
  }

  // ─── Access control ────────────────────────────────────────────────────
  if (workout.status === "SKIPPED" || workout.status === "CANCELLED") {
    redirect("/training");
  }

  if (workout.status === "PLANNED") {
    const blockingWorkout = await prisma.workout.findFirst({
      where: {
        userId: user.id,
        exerciseId: workout.exerciseId,

        status: {
          in: ["PLANNED", "IN_PROGRESS"],
        },

        OR: [
          {
            scheduledDate: {
              lt: workout.scheduledDate,
            },
          },
          {
            scheduledDate: workout.scheduledDate,
            workoutNumber: {
              lt: workout.workoutNumber,
            },
          },
        ],
      },
      orderBy: [
        {
          scheduledDate: "asc",
        },
        {
          workoutNumber: "asc",
        },
      ],
      select: {
        id: true,
      },
    });

    if (blockingWorkout) {
      redirect("/training");
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto w-full">
      {/* Header */}
      <WorkoutHeader workout={workout} />

      {/* Planned */}
      {workout.status === "PLANNED" && <PlannedWorkout workout={workout} />}

      {/* In progress */}
      {workout.status === "IN_PROGRESS" && (
        <section>
          <WorkoutSession workoutId={workout.id} sets={workout.sets} />
        </section>
      )}

      {/* Completed */}
      {workout.status === "COMPLETED" && <CompletedWorkout workout={workout} />}
    </main>
  );
}
