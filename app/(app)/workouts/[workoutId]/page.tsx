// app/workhealth/app/(app)/workouts/[workoutId]/page.tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/server/auth/session";
import { prisma } from "@/app/server/db";

import WorkoutHeader from "@/app/components/workout/WorkoutHeader";
import PlannedWorkout from "@/app/components/workout/PlannedWorkout";
import WorkoutSession from "@/app/components/workout/WorkoutSession";
import CompletedWorkout from "@/app/components/workout/CompletedWorkout";
import CancelledWorkout from "@/app/components/workout/CancelledWorkout";

type WorkoutPageProps = {
  params: Promise<{
    workoutId: string;
  }>;
};

export default async function WorkoutPage({
  params,
}: WorkoutPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { workoutId } = await params;

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

  return (
    <main>
      <WorkoutHeader workout={workout} />

      {workout.status === "PLANNED" && (
        <PlannedWorkout workout={workout} />
      )}

      {workout.status === "IN_PROGRESS" && (
        <section>
          <WorkoutSession
            workoutId={workout.id}
            sets={workout.sets}
          />
        </section>
      )}

      {workout.status === "COMPLETED" && (
        <CompletedWorkout workout={workout} />
      )}

      {workout.status === "CANCELLED" && (
        <CancelledWorkout workout={workout} />
      )}
    </main>
  );
}
